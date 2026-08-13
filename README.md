# HH Goa 2026 — Frame & Builder Badge Generator

An interactive web application and PFP badge generator built for **HH Goa 2026**. Designed with Goan Azulejo tile art, tropical illustrations, sub-second client-side HTML5 2D canvas compositing, and one-tap X sharing.

---

## Project Structure

```
hh_goa_id_generator/
├── assets/                     # Design reference assets & raw SVG/PNG graphics
│   ├── image.png               # Reference badge graphic template
│   └── hhgoa_images/           # SVG icons, logos (goa_hindi.svg, etc.)
├── docs/                       # Project documentation & task PDF
│   ├── requirements.md         # Full technical specification & requirements
│   └── HH_Goa_2026...pdf       # Task specification document
├── frontend/                   # 100% Standalone React + Vite + TypeScript
│   ├── src/
│   │   ├── components/         # Upload, Crop, Form, FramePreview, ShareModal
│   │   ├── pages/              # Landing.tsx & Generator.tsx
│   │   ├── lib/                # canvasCompositor.ts & titleGenerator.ts
│   │   └── styles/             # tokens.css (Goan color system & fonts)
│   ├── public/assets/          # Brand assets for client rendering
│   └── package.json
└── README.md
```

---

## Quick Start Guide

### Run the App Locally

```bash
cd frontend

# Install dependencies
npm install

# Start Vite dev server
npm run dev
```
The application will run locally at `http://localhost:3000` (or `http://localhost:5173`).

---

## Key Features

- **100% Client-Side Engine**: Zero backend required! Renders high-res 1024×1536 9:16 vertical pass graphics directly in the browser via HTML5 2D Canvas.
- **Goan Azulejo Art & Color Palette**: Authentic jungle green (`#026834`), sun gold yellow (`#FEE101`), and hot pink (`#FF007A`) Hindi **"गोवा"** stamp design.
- **iPhone HEIC Photo Support**: Automatic client-side HEIC conversion via `heic2any`.
- **Sub-Second Live Preview**: Real-time rendering during pan/zoom cropping, name typing, and role selecting.
- **One-Tap X Sharing**: Triggers instant high-res PNG download, copies image blob to system clipboard, and opens X compose with pre-filled funky captions.
