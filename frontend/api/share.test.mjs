/**
 * Tests for the share page. Run with:  node api/share.test.mjs
 *
 * These cover the parts that are dangerous to get wrong: the image-host
 * allowlist (og:image is fetched and cached by third parties) and HTML escaping
 * (params are reflected into the page).
 */
import handler from './share.js';

const FALLBACK = 'https://vector-labs-roan.vercel.app/assets/hackers.png';

/** Mirror of encodeSharePayload in src/lib/sharePayload.ts. */
function encode(payload) {
  return Buffer.from(JSON.stringify(payload))
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function call(query) {
  let body = '';
  let status = 0;
  handler(
    { query },
    {
      setHeader() {},
      status(code) { status = code; return this; },
      send(html) { body = html; return this; },
    }
  );
  return { status, body };
}

const render = (payload) => call({ d: encode(payload) }).body;
const meta = (html, prop) => {
  const m = html.match(new RegExp(`<meta (?:property|name)="${prop}" content="([^"]*)"`));
  return m ? m[1] : '(none)';
};

let failures = 0;
function check(label, actual, expected) {
  const ok = actual === expected;
  if (!ok) failures++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}`);
  if (!ok) console.log(`        expected: ${expected}\n        actual:   ${actual}`);
}

// --- image host allowlist -------------------------------------------------
check(
  'allowlisted imgbb host accepted',
  meta(render({ img: 'https://i.ibb.co/abc123/badge.png', name: 'Sahaj' }), 'og:image'),
  'https://i.ibb.co/abc123/badge.png'
);
check(
  'allowlisted cloudinary host accepted',
  meta(render({ img: 'https://res.cloudinary.com/x/badge.png' }), 'og:image'),
  'https://res.cloudinary.com/x/badge.png'
);
check(
  'foreign host rejected',
  meta(render({ img: 'https://evil.example.com/tracker.png' }), 'og:image'),
  FALLBACK
);
check(
  'lookalike subdomain rejected',
  meta(render({ img: 'https://i.ibb.co.evil.com/x.png' }), 'og:image'),
  FALLBACK
);
check('plain http rejected', meta(render({ img: 'http://i.ibb.co/a/b.png' }), 'og:image'), FALLBACK);
check('unparseable url rejected', meta(render({ img: 'not a url' }), 'og:image'), FALLBACK);

// --- malformed tokens must not throw -------------------------------------
check('garbage token returns 200', call({ d: '!!!not-base64!!!' }).status, 200);
check('missing token returns 200', call({}).status, 200);
check('array payload rejected', meta(call({ d: encode(['a']) }).body, 'og:image'), FALLBACK);

// --- HTML escaping -------------------------------------------------------
const injected = render({
  img: 'https://i.ibb.co/abc123/badge.png',
  name: '"><script>alert(1)</script>',
});
check('no raw <script> reflected', /<script>alert\(1\)<\/script>/.test(injected), false);
check('injection escaped instead', injected.includes('&lt;script&gt;alert(1)&lt;/script&gt;'), true);
check('attribute not broken out of', /content="[^"]*"><script/.test(injected), false);

// --- length clamping -----------------------------------------------------
check(
  'name clamped to 60 chars',
  meta(render({ img: 'https://i.ibb.co/a/b.png', name: 'x'.repeat(500) }), 'og:title'),
  'x'.repeat(60) + ' at HH Goa 2026'
);
check(
  'title clamped to 60 chars',
  meta(render({ img: 'https://i.ibb.co/a/b.png', name: 'Sahaj', title: 'y'.repeat(500) }), 'og:title'),
  `Sahaj — &quot;${'y'.repeat(60)}&quot; at HH Goa 2026`
);

// --- the bug this encoding exists to prevent -----------------------------
// The generated share URL must contain nothing domain-shaped, or X's composer
// rewrites it. base64url is [A-Za-z0-9-_] only: no dots, no slashes.
const token = encode({ img: 'https://i.ibb.co/abc123/badge.png', name: 'Sahaj' });
check('token has no dot for X to linkify', token.includes('.'), false);
check('token has no slash', token.includes('/'), false);
check('token is base64url only', /^[A-Za-z0-9_-]+$/.test(token), true);

// --- unicode names survive the round trip --------------------------------
check(
  'unicode name round-trips',
  meta(render({ img: 'https://i.ibb.co/a/b.png', name: 'साहज' }), 'og:title'),
  'साहज at HH Goa 2026'
);

console.log(failures === 0 ? '\nALL PASS' : `\n${failures} FAILURE(S)`);
process.exit(failures === 0 ? 0 : 1);
