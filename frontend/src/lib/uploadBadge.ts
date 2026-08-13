/**
 * Give the generated badge a public URL.
 *
 * The badge only exists as bytes inside the user's browser tab, which means it
 * has no address anyone else can fetch. X's crawler runs on X's servers, so for
 * a link preview to show the badge, the bytes must first live somewhere publicly
 * reachable. That is the whole reason this file exists — no drawing happens
 * server-side, we only need an address.
 *
 * Uses imgbb, whose upload endpoint accepts a direct POST from the browser, so
 * no backend of ours is involved.
 *
 * NOTE ON THE KEY: VITE_ variables are inlined into the client bundle and are
 * therefore public. This is an upload-only key, so the exposure is quota abuse
 * rather than data loss — acceptable for an event tool, not for production.
 * Rotate it if it gets hammered.
 */

const IMGBB_KEY = import.meta.env.VITE_IMGBB_KEY as string | undefined;

/** Whether a share link with a working preview is possible at all. */
export const canUploadBadge = Boolean(IMGBB_KEY);

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result);
      // readAsDataURL yields "data:image/png;base64,AAAA..." — imgbb wants only
      // the payload after the comma.
      const comma = result.indexOf(',');
      resolve(comma >= 0 ? result.slice(comma + 1) : result);
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

/**
 * Upload the badge and return its public URL, or null if it could not be
 * uploaded for any reason. Callers must treat null as "fall back to the
 * caption-only share" rather than as a fatal error — a failed upload should
 * never block the user from sharing.
 */
export async function uploadBadge(file: File): Promise<string | null> {
  try {
    const form = new FormData();
    form.append('reqtype', 'fileupload');
    form.append('fileToUpload', file);

    const response = await fetch('https://catbox.moe/user/api.php', {
      method: 'POST',
      body: form
    });

    if (!response.ok) {
      console.warn('Badge upload failed:', response.status);
      return null;
    }

    const url = await response.text();
    return url.startsWith('http') ? url : null;
  } catch (error) {
    console.warn('Badge upload error:', error);
    return null;
  }
}
