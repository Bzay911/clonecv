import { SITE_URL } from '@/constants/api-config';
import { authClient } from '@/lib/auth-client';

/** Returns the response's `data`, or throws its `error` (so useQuery can catch it). */
export async function api<T = any>(path: string, method = 'GET', body?: object): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${SITE_URL}/api/v1${path}`, {
      method,
      credentials: 'omit',
      headers: {
        'Content-Type': 'application/json',
        Cookie: await authClient.getCookie(),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error("Couldn't reach CloneCV. Check your connection and try again.");
  }

  if (res.status === 401) authClient.signOut();

  const json = await res.json().catch(() => ({ ok: false, error: 'Something went wrong. Try again.' }));
  if (!json.ok) throw new Error(json.error);
  return json.data;
}
