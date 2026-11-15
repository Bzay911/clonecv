import { useMutation } from "@tanstack/react-query";
import { File, Paths } from "expo-file-system";
import * as Sharing from "expo-sharing";
import { Alert } from "react-native";

import { SITE_URL } from "@/constants/api-config";
import { authClient } from "@/lib/auth-client";

export async function downloadResumePdf(id: string, name: string): Promise<File> {
  let res: Response;
  try {
    res = await fetch(`${SITE_URL}/api/v1/resumes/${id}/pdf`, {
      credentials: "omit",
      headers: { Cookie: await authClient.getCookie() },
    });
  } catch {
    throw new Error("Couldn't reach CloneCV. Check your connection and try again.");
  }

  if (res.status === 401) authClient.signOut();

  // Errors come back as JSON like { ok: false, error: "Resume not found." }
  const type = res.headers.get("content-type") ?? "";
  if (!res.ok || !type.includes("application/pdf")) {
    const json = await res.json().catch(() => null);
    throw new Error(json?.error ?? "Could not create the PDF. Try again.");
  }

  // File names can't contain / \ : * ? " < > |
  const safeName = name.replace(/[\\/:*?"<>|]/g, "-").trim() || "Resume";
  const file = new File(Paths.cache, `${safeName}.pdf`);
  if (file.exists) file.delete(); // start clean so an old copy can't be left behind
  await file.write(new Uint8Array(await res.arrayBuffer()));
  return file;
}

async function sharePdf(file: File, name: string) {
  if (!(await Sharing.isAvailableAsync())) {
    throw new Error("Sharing isn't available on this device.");
  }
  await Sharing.shareAsync(file.uri, {
    mimeType: "application/pdf", // Android
    UTI: "com.adobe.pdf", // iOS
    dialogTitle: name, // Android
  });
}

// preview() / canPreview() are typed as optional so this compiles whether or not
// your expo-file-system version has them
type Previewable = File & {
  canPreview?: () => Promise<boolean>;
  preview?: (options?: { title?: string }) => Promise<void>;
};

/** Opens the PDF in the native viewer (Quick Look on iOS); falls back to the share sheet. */
async function openPdf(file: File, name: string) {
  const previewable = file as Previewable;
  try {
    if (previewable.preview) {
      const canPreview = previewable.canPreview ? await previewable.canPreview() : true;
      if (canPreview) {
        await previewable.preview({ title: name });
        return;
      }
    }
  } catch {
    // Preview failed (e.g. no PDF app on Android): use the share sheet instead
  }
  await sharePdf(file, name);
}

type Args = {
  id: string;
  name: string;
  /** Runs first, e.g. to wait for pending autosaves, because the server renders the saved copy */
  beforeDownload?: () => Promise<void>;
};

export function useDownloadResumePdf() {
  return useMutation({
    mutationFn: async ({ id, name, beforeDownload }: Args) => {
      await beforeDownload?.();
      const file = await downloadResumePdf(id, name);
      await openPdf(file, name);
    },
    onError: (error) => Alert.alert("Couldn't open the PDF", error.message),
  });
}