import { useEffect, useRef } from 'react';

import { saveResumeContent, useSaveResumeContent } from './queries/save-resume-content';
import type { ResumeContent } from './types';

const DELAY_MS = 800;

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

/** Saves `content` 0.8s after it stops changing. Returns the save status for the UI. */
export function useAutosave(id: string, content: ResumeContent | null) {
  const save = useSaveResumeContent();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const unsaved = useRef<ResumeContent | null>(null);
  const isFirst = useRef(true);

  useEffect(() => {
    if (!content) return;
    // The first value is what we loaded from the server, so there's nothing to save
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    unsaved.current = content;
    if (timer.current) clearTimeout(timer.current); // typing again restarts the countdown
    timer.current = setTimeout(() => {
      unsaved.current = null;
      save.mutate({ id, content });
    }, DELAY_MS);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content]);

  // Leaving the screen: save anything still waiting
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
      if (unsaved.current) saveResumeContent({ id, content: unsaved.current });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const status: SaveStatus = save.isPending
    ? 'saving'
    : save.isError
      ? 'error'
      : save.isSuccess
        ? 'saved'
        : 'idle';

  const retry = () => {
    if (content) save.mutate({ id, content });
  };

  return { status, retry };
}