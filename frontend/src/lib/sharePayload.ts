/**
 * Pack the share-page parameters into a single opaque token.
 *
 * WHY NOT PLAIN QUERY PARAMS: X's tweet composer scans the text it is given and
 * auto-linkifies anything domain-shaped. A share link of the form
 *
 *     /api/share?img=https%3A%2F%2Fi.ibb.co%2Fabc%2Fbadge.png
 *
 * gets mangled in the composer — X sees `i.ibb.co` inside the parameter and
 * rewrites it, producing `...%2F%https://2Fi.ibb.co%2F...` and a dead link.
 * Observed live, 2026-08-13.
 *
 * base64url output contains only [A-Za-z0-9-_], so there is no dot, no slash and
 * no domain for the composer to find. The host allowlist on the server side is
 * still enforced after decoding — this encoding is about surviving transport, not
 * about trust.
 */

export interface SharePayload {
  /** Public URL of the uploaded badge PNG. */
  img: string;
  name?: string;
  title?: string;
}

export function encodeSharePayload(payload: SharePayload): string {
  const bytes = new TextEncoder().encode(JSON.stringify(payload));

  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);

  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}
