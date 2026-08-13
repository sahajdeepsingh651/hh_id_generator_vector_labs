import React, { useEffect, useState } from 'react';
import { Download, Loader2, RefreshCw, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { uploadBadge } from '../lib/uploadBadge';
import { encodeSharePayload } from '../lib/sharePayload';

interface ShareModalProps {
  canvasElement: HTMLCanvasElement | null;
  shareUrl?: string;
  name: string;
  stackRole?: string;
  builderTitle?: string;
  onReset?: () => void;
}

const FUNKY_CAPTIONS = [
  (name: string, role: string) =>
    `🌴 Goa mode: ACTIVATED ⚡ ${name} (${role}) is officially shipping at HH Goa 2026! 🚀 Coconut water in hand, code on screen. #FrameInGoa #HHGoa2026`,
  (name: string, title: string) =>
    `⚡ Minted my official HH Goa 2026 Pass! 🌴 "${title}" ${name} reporting for beach hackathon duty 🌊 See you in paradise! #FrameInGoa #HHGoa2026`,
  (name: string, role: string) =>
    `🚀 Building the future from the beaches of Goa! 🌊 ${name} — ${role} @ HH Goa 2026 🌴 Check out my builder pass 👇 #FrameInGoa #HHGoa2026`,
  (name: string) =>
    `🔥 Sun, Sea & Shipping Code! 🏝️ ${name} is ready for Hacker House Goa 2026 ⚡ Let's build! #FrameInGoa #HHGoa2026`,
];

/** Turn the finished canvas into a real PNG File. */
function canvasToPngFile(canvas: HTMLCanvasElement, fileName: string): Promise<File | null> {
  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => resolve(blob ? new File([blob], fileName, { type: 'image/png' }) : null),
      'image/png'
    );
  });
}

export const ShareModal: React.FC<ShareModalProps> = ({
  canvasElement,
  name,
  stackRole = 'Developer',
  builderTitle = 'Terminal Wizard',
  onReset,
}) => {
  const [downloading, setDownloading] = useState(false);

  // The PNG is prepared up-front, NOT inside the click handler.
  //
  // navigator.share() must be invoked synchronously within the user gesture that
  // triggered it. canvas.toBlob() is async, so awaiting it inside the click handler
  // loses the gesture and Safari rejects the share (and desktop popup-blocks
  // window.open for the same reason). Preparing the file on mount keeps both paths
  // callable without an await. The badge is final by the time this component
  // renders — it only mounts on step 4 — so one snapshot is correct.
  const [shareFile, setShareFile] = useState<File | null>(null);

  // URL of an /api/share page whose og:image points at the uploaded badge.
  // Null means the upload hasn't finished or isn't configured — in that case the
  // tweet goes out caption-only rather than with a link that previews nothing.
  const [shareUrl, setShareUrl] = useState<string | null>(null);

  const fileName = `hh-goa-2026-${(name || 'pass').toLowerCase().replace(/\s+/g, '-')}.png`;

  useEffect(() => {
    if (!canvasElement) return;
    let cancelled = false;
    canvasToPngFile(canvasElement, fileName).then((file) => {
      if (!cancelled) setShareFile(file);
    });
    return () => {
      cancelled = true;
    };
  }, [canvasElement, fileName]);

  // Upload starts as soon as the badge exists, not when Share is clicked, so the
  // network round trip overlaps with the user reading the result screen. By the
  // time they click, the URL is normally ready — and the click handler stays
  // synchronous, which navigator.share() and window.open() both require.
  useEffect(() => {
    if (!canvasElement) return;
    let cancelled = false;

    // Twitter Link Previews are wide (1200x630). Because the badge is vertical,
    // Twitter will crop off the top and bottom. We create a landscape canvas
    // right here and paste the badge in the center so it never looks cropped!
    const ogCanvas = document.createElement('canvas');
    ogCanvas.width = 1200;
    ogCanvas.height = 630;
    const ctx = ogCanvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#FFF8EB'; // Matching background cream color
      ctx.fillRect(0, 0, 1200, 630);
      
      // Calculate scaled dimensions to fit height 590 (padding 20px top/bottom)
      // canvasElement is inherently 1024x1536 from canvasCompositor
      const scale = 590 / 1536; 
      const drawW = 1024 * scale;
      const drawH = 1536 * scale;
      const drawX = (1200 - drawW) / 2;
      const drawY = (630 - drawH) / 2;
      
      // Add a subtle drop shadow
      ctx.shadowColor = 'rgba(6, 55, 37, 0.2)'; // Dark green shadow
      ctx.shadowBlur = 30;
      ctx.shadowOffsetY = 10;
      ctx.fillRect(drawX, drawY, drawW, drawH);
      ctx.shadowBlur = 0;
      ctx.shadowOffsetY = 0;
      
      // Draw the vertical badge in the center of the landscape frame
      ctx.drawImage(canvasElement, drawX, drawY, drawW, drawH);
      
      ogCanvas.toBlob((blob) => {
        if (cancelled || !blob) return;
        const ogFile = new File([blob], 'og-image.png', { type: 'image/png' });
        
        // Upload the beautiful landscape version to ImgBB
        uploadBadge(ogFile).then((imageUrl) => {
          if (cancelled || !imageUrl) return;
          // Single opaque parameter to prevent X's composer from linkifying
          const token = encodeSharePayload({ img: imageUrl, name, title: builderTitle });
          setShareUrl(`${window.location.origin}/api/share?d=${token}`);
        });
      }, 'image/png');
    }

    return () => {
      cancelled = true;
    };
  }, [canvasElement, name, builderTitle]);

  const triggerConfetti = () => {
    confetti({
      particleCount: 90,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#026834', '#FEE101', '#FF007A', '#E52B50'],
    });
  };

  const buildCaption = () => {
    const template = FUNKY_CAPTIONS[Math.floor(Math.random() * FUNKY_CAPTIONS.length)];
    return template(name || 'Goan Builder', stackRole || builderTitle);
  };

  const saveToDisk = () => {
    if (!canvasElement) return;
    setDownloading(true);

    canvasElement.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
      setDownloading(false);
    }, 'image/png');
  };

  const handleDownload = () => {
    triggerConfetti();
    saveToDisk();
  };

  /**
   * Desktop path: X's intent URL cannot carry a file, so the best available
   * combination is caption prefilled + image on the clipboard + image on disk.
   */
  const shareViaIntent = (caption: string) => {
    if (shareFile && navigator.clipboard && 'ClipboardItem' in window) {
      try {
        navigator.clipboard
          .write([new ClipboardItem({ 'image/png': shareFile })])
          .catch((e) => console.warn('Clipboard write ignored:', e));
      } catch (e) {
        console.warn('Clipboard write ignored:', e);
      }
    }

    // Attaching a file to the intent URL is impossible — X does not support it.
    // A link to our /api/share page is the next best thing: X's crawler fetches
    // it, finds og:image, and renders the badge as the preview card.
    const params = new URLSearchParams({ text: caption });
    if (shareUrl) params.set('url', shareUrl);

    window.open(
      `https://twitter.com/intent/tweet?${params.toString()}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  const handleShareToX = () => {
    const caption = buildCaption();

    // Mobile path: hand the actual PNG to the OS share sheet, which passes it to
    // the X app as a genuine attachment. No server, no URL, no crawler involved.
    if (shareFile && navigator.canShare?.({ files: [shareFile] })) {
      navigator
        .share({ files: [shareFile], text: caption })
        .then(triggerConfetti)
        .catch((err: unknown) => {
          // User dismissed the sheet — not an error, and not a reason to fall back.
          if (err instanceof DOMException && err.name === 'AbortError') return;
          shareViaIntent(caption);
        });
      return;
    }

    shareViaIntent(caption);
  };

  return (
    <div className="w-full max-w-sm mx-auto flex flex-col space-y-3">

      {/* 1. Download Pass Button (Solid Green) */}
      <button
        type="button"
        onClick={handleDownload}
        disabled={downloading}
        className="w-full h-13 py-3 bg-[#026834] text-[#FEE101] border-2 border-[#026834] rounded-2xl font-sans font-extrabold text-base hover:bg-[#014321] active:scale-95 transition-all flex items-center justify-center space-x-3 cursor-pointer"
      >
        {downloading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <Download className="w-5 h-5 text-[#FEE101]" />
        )}
        <span>Download Pass</span>
      </button>

      {/* 2. Direct Share to X Button */}
      <button
        type="button"
        onClick={handleShareToX}
        className="w-full h-13 py-3 bg-[#FEE101] text-[#026834] border-2 border-[#026834] rounded-2xl font-sans font-extrabold text-base hover:bg-[#ffe833] active:scale-95 transition-all flex items-center justify-center space-x-3 cursor-pointer"
      >
        <svg className="w-5 h-5 fill-[#026834]" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
        <div className="flex items-center space-x-1">
          <span>Share to X</span>
          <Sparkles className="w-4 h-4 text-[#FF007A]" />
        </div>
      </button>

      {/* 3. Generate Another Pass Button */}
      <button
        type="button"
        onClick={onReset}
        className="w-full h-13 py-3 bg-white text-[#026834] border-2 border-[#026834] rounded-2xl font-sans font-extrabold text-base hover:bg-[#FFF8EB] active:scale-95 transition-all flex items-center justify-center space-x-3 cursor-pointer"
      >
        <RefreshCw className="w-5 h-5 text-[#026834]" />
        <span>Generate Another Pass</span>
      </button>
    </div>
  );
};
