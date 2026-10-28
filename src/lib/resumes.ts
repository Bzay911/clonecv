import { SITE_URL } from '@/constants/api-config';
import { authClient } from '@/lib/auth-client';
import type { Result, Resume } from '@/types/resume';

export async function listResumes(): Promise<Result<Resume[]>> {
  try {
    const res = await fetch(`${SITE_URL}/api/v1/resumes`, {
      headers: { Cookie: await authClient.getCookie() },
      credentials: 'omit',
    });
    return await res.json();
  } catch {
    return { ok: false, error: "Couldn't reach CloneCV. Check your connection and try again." };
  }
}
