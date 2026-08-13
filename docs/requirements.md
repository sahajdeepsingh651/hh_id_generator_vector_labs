# HH Goa 2026 — Frame / ID Card Generator: Requirements

Stack: **React (Vite) + Tailwind CSS** (frontend) · **Python FastAPI** (backend)

---

## 1. Project Structure

```
hh-goa-frame-generator/
├── frontend/                  # React + Vite + Tailwind
│   ├── src/
│   │   ├── assets/
│   │   │   ├── frames/        # frame PNGs (transparent center cutout)
│   │   │   └── fonts/         # self-hosted Imbue / Victor Mono (optional, faster than Google Fonts CDN)
│   │   ├── components/
│   │   │   ├── UploadStep.tsx
│   │   │   ├── CropStep.tsx
│   │   │   ├── DetailsForm.tsx
│   │   │   ├── FramePreview.tsx
│   │   │   ├── ShareButtons.tsx
│   │   │   └── DownloadButton.tsx
│   │   ├── pages/
│   │   │   ├── Landing.tsx
│   │   │   └── Generator.tsx
│   │   ├── lib/
│   │   │   ├── canvasCompositor.ts   # client-side canvas rendering
│   │   │   ├── heicConvert.ts
│   │   │   └── api.ts
│   │   ├── styles/
│   │   │   └── tokens.css      # brand tokens (already generated)
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── index.html
│   ├── vite.config.ts
│   └── package.json
│
├── backend/                   # FastAPI
│   ├── app/
│   │   ├── main.py
│   │   ├── routers/
│   │   │   ├── generate.py     # POST /generate
│   │   │   └── share.py        # GET /r/{share_id}  (OG preview page)
│   │   ├── services/
│   │   │   ├── compositor.py   # Pillow-based frame compositing
│   │   │   ├── title_generator.py  # "builder title" + traits generator
│   │   │   └── storage.py      # save/serve generated images
│   │   ├── models/
│   │   │   └── schemas.py      # Pydantic request/response models
│   │   ├── assets/
│   │   │   ├── frames/         # same frame PNGs as frontend (source of truth for server render)
│   │   │   └── fonts/          # Imbue-Bold.ttf, VictorMono-Bold.ttf, VictorMono-SemiBold.ttf
│   │   └── config.py
│   ├── requirements.txt
│   └── .env.example
│
└── README.md
```

---

## 2. Frontend Setup (React + Vite + Tailwind)

### 2.1 Scaffold the app
```bash
npm create vite@latest frontend -- --template react-ts
cd frontend
npm install
```

### 2.2 Install Tailwind CSS
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```
Configure `tailwind.config.js` content paths and extend with the brand tokens already generated (`brand.primary`, `brand.accent`, `brand.pink`, `brand.offwhite`, `fontFamily.heading`, `fontFamily.body`).

Import `tokens.css` (CSS variables + font `@import`) at the top of `src/index.css`, before the `@tailwind base;` directive.

### 2.3 Core libraries

| Purpose | Package | Why |
|---|---|---|
| Routing | `react-router-dom` | Landing → Generator page navigation |
| Image crop/reposition | `react-easy-crop` | Handles portrait/landscape/off-center photos — required per brief |
| HEIC → JPEG conversion | `heic2any` | iPhone photos are HEIC by default; browsers/canvas can't render HEIC natively |
| Canvas compositing (client preview) | native `<canvas>` + `Canvas 2D API` (no extra lib needed) | Live near-instant preview while user adjusts crop/text |
| Alternative: DOM-to-image export | `html-to-image` (or `html2canvas`) | Fallback if you prefer compositing the final frame as styled HTML/CSS rather than raw canvas drawing — easier for text layout, slightly heavier |
| Form handling | `react-hook-form` | Name / stack-role form validation |
| State/data fetching | `@tanstack/react-query` (optional) or plain `fetch` in `lib/api.ts` | Talking to FastAPI `/generate` endpoint |
| Native share sheet | Web Share API (built into browser, no package — use `navigator.share` / `navigator.canShare`) | Best mobile share path — shares image directly into X app |
| Icons | `lucide-react` | Share/download/upload icons |
| Animations (optional, nice-to-have) | `framer-motion` | Step transitions, success state |

```bash
npm install react-router-dom react-easy-crop heic2any react-hook-form lucide-react
npm install html-to-image   # only if going the HTML/CSS compositing route
```

### 2.4 Environment variables (`frontend/.env`)
```
VITE_API_BASE_URL=https://api.yourapp.com
VITE_SHARE_HASHTAG=FrameInGoa
VITE_X_INTENT_URL=https://twitter.com/intent/tweet
```

---

## 3. Backend Setup (Python FastAPI)

### 3.1 Scaffold
```bash
python -m venv venv
source venv/bin/activate        # venv\Scripts\activate on Windows
pip install fastapi "uvicorn[standard]"
```

### 3.2 Core libraries (`backend/requirements.txt`)

```txt
fastapi==0.115.*
uvicorn[standard]==0.32.*
python-multipart==0.0.*        # required for file upload form parsing
pillow==11.*                    # image compositing: paste photo into frame, draw text, masks
pydantic==2.*
pydantic-settings==2.*          # typed .env config loading
python-dotenv==1.*
pillow-heif==0.*                 # decode HEIC server-side as a safety-net if client conversion fails
aiofiles==24.*                   # async file writes for generated images
jinja2==3.*                      # server-render the OG-preview HTML page (needed for X link unfurling)
boto3==1.*                       # ONLY if using S3 for image storage (skip if storing on local disk/volume)
slowapi==0.1.*                   # basic rate limiting on /generate to prevent abuse (no login wall = needs throttling)
```

```bash
pip install -r requirements.txt
```

### 3.3 Run
```bash
uvicorn app.main:app --reload --port 8000
```

### 3.4 Environment variables (`backend/.env`)
```
APP_BASE_URL=https://api.yourapp.com
FRONTEND_BASE_URL=https://yourapp.com
STORAGE_BACKEND=local            # local | s3
STORAGE_DIR=./generated
S3_BUCKET_NAME=
S3_REGION=
IMAGE_TTL_HOURS=72                # how long generated images stay before cleanup
MAX_UPLOAD_MB=15
RATE_LIMIT_PER_MINUTE=10
```

### 3.5 Why compositing needs to happen server-side too (not just client canvas)
The brief requires the **X link preview (OG image)** to show the actual generated graphic. X's crawler does not execute JavaScript, so a client-only canvas render is invisible to it — you need a persisted, publicly-served image + a server-rendered HTML page with `<meta property="og:image">` pointing to it. Practical flow:
1. Client composites a fast local preview (canvas) so the UI feels instant.
2. On "Generate" / "Share", the same image + form data is POSTed to `/generate`.
3. FastAPI (Pillow) re-composites server-side for guaranteed consistent quality, saves the file, returns `{ image_url, share_id, share_page_url }`.
4. `GET /r/{share_id}` returns a lightweight server-rendered HTML page (Jinja2, not the SPA) with proper `og:image` / `twitter:card` meta tags — this is the URL you put into the X intent link.

---

## 4. Sharing to X (Twitter) — requirements in detail

X's `intent/tweet` endpoint **cannot attach an image file via URL parameters** — this is a hard platform limitation, not something to build around. Implement all three paths so every device gets the best available option:

### 4.1 Primary (mobile): Web Share API — attaches the image directly
```ts
async function shareToX(imageBlob: Blob, caption: string) {
  const file = new File([imageBlob], "hh-goa-2026.png", { type: "image/png" });
  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    await navigator.share({
      files: [file],
      text: caption,               // caption + #FrameInGoa
    });
  } else {
    fallbackShare(caption);
  }
}
```
No extra package needed — this is a native browser API. Support: iOS Safari, Android Chrome. Not supported on most desktop browsers → always keep the fallback.

### 4.2 Fallback (desktop / unsupported browsers): download + X compose intent
```ts
function fallbackShare(caption: string, shareUrl: string) {
  // 1. Trigger image download so user can drag/attach it manually
  triggerDownload(imageDataUrl, "hh-goa-2026.png");
  // 2. Open X compose pre-filled with caption + hashtag + link (OG-preview URL)
  const text = encodeURIComponent(`${caption} #FrameInGoa`);
  const url = encodeURIComponent(shareUrl); // the /r/{share_id} permalink
  window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, "_blank");
}
```

### 4.3 Backend requirement for the fallback to look good: OG meta tags
`GET /r/{share_id}` (Jinja2 template, server-rendered, NOT the React SPA route):
```html
<meta property="og:title" content="I'm a Goan Adventurer at HH Goa 2026" />
<meta property="og:image" content="{{ image_url }}" />
<meta property="og:image:width" content="1080" />
<meta property="og:image:height" content="1920" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:image" content="{{ image_url }}" />
```
Test unfurling with the **Twitter Card Validator** equivalent (X's own preview in compose, or a service like `opengraph.xyz`) before shipping — X's crawler caches aggressively, so use a fresh `share_id` per generation rather than a single static URL.

### 4.4 Summary of libraries for this section
| Need | Tool |
|---|---|
| Native share sheet | `navigator.share` (built-in) |
| Manual download trigger | plain `<a download>` / Blob URL (built-in) |
| X compose intent | plain URL (`twitter.com/intent/tweet`), no SDK needed |
| Server-rendered OG page | FastAPI + Jinja2 |
| Verify unfurl before launch | X compose preview / opengraph.xyz (manual QA, not a dependency) |

---

## 5. Theme (reuse tokens already generated)

- **Primary green**: `#0B6839`
- **Accent yellow**: `#FEE101`
- **Secondary yellow**: `#F9DC01`
- **Text-on-dark yellow-green**: `#EDD723`
- **White**: `#FFFFFF`
- **Pink / off-white**: placeholders pending Brand Kit confirmation (see `tailwind.config.js` / `tokens.css` delivered earlier)
- **Heading font**: Imbue (bold display type)
- **Body/label font**: Victor Mono (uppercase, tracked-out labels)

Your reference image uses a **Goan-tile / azulejo border + cream matting + folk-art illustration band** treatment. For HH Goa 2026 this should be re-skinned in the event's own visual language (green/yellow, terminal/hacker-house aesthetic per the site copy — "developers who live in their terminals") rather than the literal floral-tile art, so it reads as *this event* and not a generic tourism template — but the **layout structure** (border → photo window → title plaque → trait list → stat pill) is a good pattern to reuse.

---

## 6. PFP Frame Template — Dynamic Structure Spec

### 6.1 Canvas
- Fixed output size: **1080 × 1920px** (9:16, ideal for both PFP crop and X card preview)
- Frame asset is a **PNG with a transparent cutout window** in the middle — the user's photo is drawn *behind* the frame layer so the border/illustrations always sit on top, cleanly, regardless of photo content.

### 6.2 Layer stack (bottom → top)
1. **Background fill** — solid `brand.primary` or subtle texture, in case the photo doesn't fully cover the window
2. **User photo** — drawn into the transparent window area, cropped via `react-easy-crop` (object-fit: cover, user-controlled pan/zoom so off-center subjects work)
3. **Frame overlay PNG** — the decorative border + illustration bands + photo-window matting, exported once as a static asset (from Figma/Illustrator), same for every user
4. **Text layer — Name** — dynamic, user-entered
5. **Text layer — Builder Title** — dynamic, generated (see 6.3)
6. **Text layer — Traits row** — dynamic, generated from stack/role (see 6.3)
7. **Stat pill** (optional, e.g. "BUILDER LEVEL: X%") — dynamic or fixed per event phase

### 6.3 Dynamic content generation (mirrors your reference image's "GOAN ADVENTURER" + traits)
Backend `services/title_generator.py`:
- Input: `stack_or_role` (e.g. "Full-stack / React+Node"), optional `interests`
- Maps role keywords → a **builder title** (e.g. "Frontend" → "Pixel Whisperer", "Backend" → "Server Whisperer", "AI/ML" → "Model Tamer", "Fullstack" → "Full-Stack Nomad") via a keyword-to-title lookup table (extend as needed)
- Generates **2–4 trait tags** from the same input (e.g. "React" → "UI Perfectionist", "Python" → "Script Sorcerer") — same pattern as "Cultural Enthusiast / Beach Lover / Art collector / Foodie" in your reference
- Returns `{ builder_title: str, traits: list[str] }` so it's consistent between preview (client can call the same endpoint or replicate the mapping) and the final server render

### 6.4 Font application inside the frame
- **Name**: Victor Mono, Bold, uppercase, tracked-out (matches site's label style)
- **Builder Title** (large hero text, like "GOAN ADVENTURER"): Imbue, Bold/Extrabold — render in `brand.accent` yellow with a subtle dark outline/shadow for legibility over the textured background, similar to the ornate patterned-fill effect in your reference but simplified to flat brand yellow for reliable programmatic rendering (patterned text fills are very hard to do dynamically/performantly — flat color + outline is the practical substitute)
- **Traits row**: Victor Mono, Semibold, small caps, arranged 2×2 or inline with bullet/star glyphs
- **Stat pill**: Victor Mono, Bold, on a rounded pill background in `brand.accent`

### 6.5 Client-side rendering approach
Two viable approaches — pick one, don't mix:

**Option A — Canvas 2D (recommended for speed + exact server parity)**
- `lib/canvasCompositor.ts` draws: cropped photo → frame PNG → text (using `ctx.font` with the loaded Imbue/Victor Mono web fonts via `document.fonts.load`)
- Fast, gives a real `<canvas>` you can `.toBlob()` directly for download/share — no extra conversion step
- Mirror the exact same drawing logic in Pillow on the backend (same coordinates, same font files) so client preview and server-generated share image match pixel-for-pixel

**Option B — HTML/CSS layout + `html-to-image` export**
- Build the frame as real DOM (easier responsive text wrapping for long names), then rasterize with `html-to-image`
- Simpler for text-heavy layouts, slightly less pixel-perfect control, slightly slower export

Given your reference template has fairly fixed text zones (title always 1–2 lines, traits always short), **Option A (Canvas)** is the better fit — more control, faster, and trivially portable to Pillow server-side.

### 6.6 Required flow (per your spec)

**Landing Page**
- Hero + brand visuals
- Single primary CTA: **"Create Your Frame"** → routes to `/generate`

**Generator Page** (`/generate`), step-based:
1. **Upload** — drag/tap to upload (jpg/png/HEIC accepted; HEIC auto-converted via `heic2any` before anything else touches it)
2. **Crop/Position** — `react-easy-crop` overlaid on a low-opacity version of the frame's photo-window shape, so user sees exactly how their crop will sit inside the cutout; pinch/drag to zoom & pan
3. **Details form** — Name (text input, required), Stack/Role (text input or select from common presets: Frontend / Backend / Fullstack / AI-ML / Design / PM, required) — both required before "Generate" is enabled
4. **Live preview** — `FramePreview.tsx` renders the canvas composite in real time as fields change (debounced re-render on text input, immediate on crop change) — this is the "proper preview visible on screen" requirement
5. **Generate** — finalizes canvas → also POSTs to backend for the OG-image-backed share image
6. **Result screen** — shows final image, **Download** button (canvas `.toBlob()` → `<a download>`), **Share to X** button (Web Share API → fallback per section 4)

### 6.7 API contract

```
POST /generate
  multipart/form-data:
    photo: File
    name: str
    stack_role: str
  → 200 OK
  {
    "share_id": "abc123",
    "image_url": "https://api.yourapp.com/image/abc123.png",
    "share_page_url": "https://api.yourapp.com/r/abc123",
    "builder_title": "Full-Stack Nomad",
    "traits": ["UI Perfectionist", "Script Sorcerer", "Beach Coder", "Late-Night Shipper"]
  }

GET /image/{share_id}      → serves the PNG (Cache-Control: public, max-age)
GET /r/{share_id}          → server-rendered HTML with OG/Twitter meta tags
```

---

## 7. Non-functional requirements checklist (from brief)

- [ ] No login/signup gate anywhere in the flow
- [ ] Upload → result under a few seconds (client canvas preview must feel instant; server round-trip only needed before the *share* step, not before showing the preview)
- [ ] Handles portrait, landscape, and off-center photos via crop tool — never assume pre-cropped input
- [ ] Output is a real downloadable file (PNG), not a canvas-only render
- [ ] Mobile-first responsive layout (Tailwind breakpoints, large tap targets, Web Share API as primary path since "most people will use this from their phone")
- [ ] Rate-limit `/generate` (slowapi) since there's no auth gate to naturally throttle abuse
- [ ] Generated images cleaned up after `IMAGE_TTL_HOURS` (cron/scheduled task or S3 lifecycle rule) to control storage costs
