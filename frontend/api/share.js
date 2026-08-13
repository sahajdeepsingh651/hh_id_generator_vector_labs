/**
 * Share page for X link previews.
 *
 * X's crawler fetches URLs with a plain HTTP GET and never executes JavaScript,
 * so a client-rendered React page is invisible to it — it only ever sees the
 * empty <div id="root">. This route returns real HTML carrying og:image, which
 * is the only way a link preview can show the generated badge.
 *
 * Stateless by design: everything the page needs arrives in the query string, so
 * there is no database, no share_id table, and nothing to expire. The badge PNG
 * itself is uploaded by the browser to an image host; we only carry its URL.
 *
 *   /api/share?d=<base64url of {img, name, title}>
 *
 * The single opaque parameter is deliberate — see src/lib/sharePayload.ts. Plain
 * query params containing a URL get corrupted by X's composer, which linkifies
 * anything domain-shaped it finds inside them.
 */

// og:image is fetched and cached by third parties, so the value must not be
// attacker-controlled. Without this allowlist the route would happily unfurl
// arbitrary remote content under this domain's name.
const ALLOWED_IMAGE_HOSTS = new Set([
  'i.ibb.co',            // imgbb
  'res.cloudinary.com',  // cloudinary
]);

const APP_URL = 'https://hh-id-generator-vector-labs.vercel.app';
const SITE_NAME = 'HH Goa 2026';
const FALLBACK_IMAGE = `${APP_URL}/assets/hackers.png`;

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Reverse of encodeSharePayload in src/lib/sharePayload.ts. */
function decodeSharePayload(raw) {
  if (!raw) return null;
  try {
    const base64 = String(raw).replace(/-/g, '+').replace(/_/g, '/');
    const parsed = JSON.parse(Buffer.from(base64, 'base64').toString('utf8'));
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function safeImageUrl(raw) {
  if (!raw) return null;
  let parsed;
  try {
    parsed = new URL(String(raw));
  } catch {
    return null;
  }
  if (parsed.protocol !== 'https:') return null;
  if (!ALLOWED_IMAGE_HOSTS.has(parsed.hostname)) return null;
  return parsed.toString();
}

function clamp(value, max) {
  const text = String(value ?? '').trim();
  return text.length > max ? text.slice(0, max) : text;
}

export default function handler(req, res) {
  const payload = decodeSharePayload(req.query.d) ?? {};

  // A missing or rejected image degrades to the site's default card rather than
  // emitting a broken og:image.
  const ogImage = safeImageUrl(payload.img) ?? FALLBACK_IMAGE;
  const name = clamp(payload.name, 60) || 'A builder';
  const title = clamp(payload.title, 60);

  const heading = title
    ? `${name} — "${title}" at ${SITE_NAME}`
    : `${name} at ${SITE_NAME}`;
  const description =
    'Built with the HH Goa 2026 Builder Pass Generator. Make your own and share it with #FrameInGoa.';

  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${escapeHtml(heading)}</title>

<meta property="og:type" content="website" />
<meta property="og:site_name" content="${escapeHtml(SITE_NAME)}" />
<meta property="og:title" content="${escapeHtml(heading)}" />
<meta property="og:description" content="${escapeHtml(description)}" />
<meta property="og:image" content="${escapeHtml(ogImage)}" />
<meta property="og:url" content="${escapeHtml(APP_URL)}" />

<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${escapeHtml(heading)}" />
<meta name="twitter:description" content="${escapeHtml(description)}" />
<meta name="twitter:image" content="${escapeHtml(ogImage)}" />

<style>
  body { font-family: system-ui, sans-serif; background:#FFF8EB; color:#063725;
         margin:0; min-height:100vh; display:flex; flex-direction:column;
         align-items:center; justify-content:center; gap:16px; padding:24px; }
  img { max-width:min(320px, 80vw); border:4px solid #063725; border-radius:20px; }
  a  { color:#026834; font-weight:700; }
</style>
</head>
<body>
  <img src="${escapeHtml(ogImage)}" alt="${escapeHtml(heading)}" />
  <p><a href="${escapeHtml(APP_URL)}">Make your own HH Goa 2026 builder pass →</a></p>

  <!--
    Redirect via JS, not <meta http-equiv="refresh">: some crawlers follow a meta
    refresh, which would send them to the SPA and lose the tags above. Crawlers
    don't run scripts, so they stay here and read the meta tags; humans land on
    the app.
  -->
  <script>window.location.replace(${JSON.stringify(APP_URL)});</script>
</body>
</html>`;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=600, s-maxage=600');
  res.status(200).send(html);
}
