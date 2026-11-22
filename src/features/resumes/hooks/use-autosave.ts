import { useEffect, useRef } from "react";

const DELAY_MS = 800;

export type SaveStatus = "idle" | "saving" | "saved" | "error";

type Options<T> = {
  value: T | null;
  /** Plain save, used to flush when leaving the screen or before a download */
  flush: (value: T) => Promise<unknown>;
  /** The mutation used for normal autosaves */
  mutate: (value: T) => void;
  state: { isPending: boolean; isError: boolean; isSuccess: boolean };
};

/** Saves `value` 0.8s after it stops changing. Returns the save status for the UI. */
export function useAutosave<T>({ value, flush, mutate, state }: Options<T>) {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const unsaved = useRef<T | null>(null);
  const isFirst = useRef(true);
  // const latest = useRef<T | null>(value);
  // latest.current = value;

  useEffect(() => {
    if (!value) return;
    // The first value is what we loaded from the server, so there's nothing to save
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    unsaved.current = value;
    if (timer.current) clearTimeout(timer.current); // changing again restarts the countdown
    timer.current = setTimeout(() => {
      unsaved.current = null;
      mutate(value);
    }, DELAY_MS);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  // Leaving the screen: save anything still waiting
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
      if (unsaved.current) flush(unsaved.current);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const status: SaveStatus = state.isPending
    ? "saving"
    : state.isError
      ? "error"
      : state.isSuccess
        ? "saved"
        : "idle";

  const retry = () => {
    if (value) mutate(value);
  };

  /**
   * Makes sure the server has the latest value, and resolves when it does.
   * Skips the request when nothing is waiting, in flight, or failed.
   */
const flushNow = async () => {
  if (timer.current) {
    clearTimeout(timer.current);
    timer.current = null;
  }
  const needsSave = unsaved.current || state.isPending || state.isError;
  unsaved.current = null;
  if (needsSave && value) await flush(value);
};

  return { status, retry, flushNow };
}