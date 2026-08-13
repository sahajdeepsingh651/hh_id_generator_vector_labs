export interface CompositeParams {
  photoImage: HTMLImageElement | null;
  cropAreaPixels?: { x: number; y: number; width: number; height: number } | null;
  zoom?: number;
  userName: string;
  builderTitle: string;
  traits: string[];
  stackRole?: string;
  passId?: string;
}

// Helper function for rounded rectangles with fallback
function pathRoundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  if (typeof ctx.roundRect === 'function') {
    ctx.roundRect(x, y, w, h, r);
  } else {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }
}

export function drawCompositeCanvas(
  canvas: HTMLCanvasElement,
  params: CompositeParams
) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const WIDTH = 1024;
  const HEIGHT = 1536;

  canvas.width = WIDTH;
  canvas.height = HEIGHT;

  // Palette matching Home Page
  const COLOR_GREEN_BG = '#026834';
  const COLOR_GREEN_DARK = '#01361B';
  const COLOR_GREEN_DEEP = '#012010';
  const COLOR_YELLOW = '#FEE101';
  const COLOR_PINK = '#FF007A';
  const COLOR_CREAM = '#FFF8EB';

  const passId = params.passId || `HH-GOA-${Math.floor(1000 + Math.random() * 9000)}`;

  // Generic Placeholders
  const displayUserName = (params.userName?.trim() || 'YOUR NAME').toUpperCase();
  const displayRole = (params.stackRole?.trim() || 'BUILDER / DEVELOPER').toUpperCase();
  const displayTitle = (params.builderTitle?.trim() || 'BUILDER PASS').toUpperCase();

  // ==========================================
  // 1. BASE BACKGROUND & HOME PAGE ORB GLOWS
  // ==========================================
  const bgGrad = ctx.createLinearGradient(0, 0, 0, HEIGHT);
  bgGrad.addColorStop(0, COLOR_GREEN_BG);
  bgGrad.addColorStop(0.5, COLOR_GREEN_DARK);
  bgGrad.addColorStop(1, COLOR_GREEN_DEEP);
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // Ambient Orbs
  ctx.save();
  const topOrb = ctx.createRadialGradient(WIDTH / 2, 200, 20, WIDTH / 2, 200, 520);
  topOrb.addColorStop(0, 'rgba(254, 225, 1, 0.32)');
  topOrb.addColorStop(1, 'rgba(254, 225, 1, 0)');
  ctx.fillStyle = topOrb;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  const bottomOrb = ctx.createRadialGradient(WIDTH / 2, 1320, 20, WIDTH / 2, 1320, 580);
  bottomOrb.addColorStop(0, 'rgba(255, 0, 122, 0.30)');
  bottomOrb.addColorStop(1, 'rgba(255, 0, 122, 0)');
  ctx.fillStyle = bottomOrb;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  ctx.restore();

  // Halftone Grid Pattern Overlay
  ctx.fillStyle = 'rgba(254, 225, 1, 0.12)';
  for (let x = 24; x < WIDTH; x += 32) {
    for (let y = 24; y < HEIGHT; y += 32) {
      ctx.beginPath();
      ctx.arc(x, y, 1.8, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Outer Border Frame
  const bw = 24;
  ctx.lineWidth = 4;
  ctx.strokeStyle = COLOR_YELLOW;
  ctx.strokeRect(bw, bw, WIDTH - bw * 2, HEIGHT - bw * 2);

  // Corner Stars
  ctx.fillStyle = COLOR_YELLOW;
  ctx.font = '24px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('✦', bw + 18, bw + 32);
  ctx.fillText('✦', WIDTH - bw - 18, bw + 32);
  ctx.fillText('✦', bw + 18, HEIGHT - bw - 14);
  ctx.fillText('✦', WIDTH - bw - 18, HEIGHT - bw - 14);

  // ==========================================
  // 2. HEADER: HACKER / HOUSE & CENTERED "गोवा"
  // ==========================================
  ctx.save();
  ctx.shadowColor = 'rgba(254, 225, 1, 0.65)';
  ctx.shadowBlur = 24;
  ctx.fillStyle = COLOR_YELLOW;
  ctx.font = '900 80px "Plus Jakarta Sans", "Space Mono", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('HACKER', WIDTH / 2, 90);
  ctx.fillText('HOUSE', WIDTH / 2, 165);
  ctx.restore();

  // Floating Hindi Stamp "गोवा"
  ctx.save();
  ctx.translate(WIDTH / 2 + 10, 125);
  ctx.rotate((6 * Math.PI) / 180);

  ctx.shadowColor = 'rgba(255, 0, 122, 0.95)';
  ctx.shadowBlur = 36;
  ctx.font = '900 84px "Rozha One", serif';
  ctx.textAlign = 'center';

  ctx.lineWidth = 4;
  ctx.strokeStyle = COLOR_YELLOW;
  ctx.strokeText('गोवा', 0, 0);

  ctx.fillStyle = COLOR_PINK;
  ctx.fillText('गोवा', 0, 0);
  ctx.restore();

  // Subtitle Subbar Pill (Y: 198 to 236)
  const pillY = 198;
  const pillW = 700;
  const pillH = 38;
  const pillX = (WIDTH - pillW) / 2;

  ctx.save();
  ctx.beginPath();
  pathRoundRect(ctx, pillX, pillY, pillW, pillH, 19);
  ctx.fillStyle = 'rgba(1, 18, 8, 0.75)';
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = 'rgba(254, 225, 1, 0.4)';
  ctx.stroke();

  ctx.fillStyle = COLOR_YELLOW;
  ctx.font = '700 15px "Space Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('GOA, INDIA • BUILDER PASS 2026', WIDTH / 2, pillY + 24);
  ctx.restore();

  // ==========================================
  // 3. IMAGE SPACE: SQUARE WITH CURVED RADIUS (Y: 260 to 700)
  // ==========================================
  const imgBoxSize = 440;
  const imgBoxRadius = 48;
  const imgBoxX = (WIDTH - imgBoxSize) / 2; // 292
  const imgBoxY = 260;

  // Outer Ring Border around Curved Square Image Space
  ctx.save();
  ctx.shadowColor = 'rgba(254, 225, 1, 0.6)';
  ctx.shadowBlur = 24;
  ctx.beginPath();
  pathRoundRect(ctx, imgBoxX - 6, imgBoxY - 6, imgBoxSize + 12, imgBoxSize + 12, imgBoxRadius + 4);
  ctx.lineWidth = 4;
  ctx.strokeStyle = COLOR_YELLOW;
  ctx.stroke();
  ctx.restore();

  // Photo Box Clip & Render
  ctx.save();
  ctx.beginPath();
  pathRoundRect(ctx, imgBoxX, imgBoxY, imgBoxSize, imgBoxSize, imgBoxRadius);
  ctx.clip();

  if (params.photoImage) {
    if (params.cropAreaPixels) {
      const { x, y, width, height } = params.cropAreaPixels;
      ctx.drawImage(
        params.photoImage,
        x, y, width, height,
        imgBoxX, imgBoxY, imgBoxSize, imgBoxSize
      );
    } else {
      const imgAspect = params.photoImage.width / params.photoImage.height;
      let renderW = imgBoxSize;
      let renderH = imgBoxSize;
      if (imgAspect > 1) {
        renderW = imgBoxSize * imgAspect;
      } else {
        renderH = imgBoxSize / imgAspect;
      }
      ctx.drawImage(
        params.photoImage,
        imgBoxX - (renderW - imgBoxSize) / 2,
        imgBoxY - (renderH - imgBoxSize) / 2,
        renderW,
        renderH
      );
    }
  } else {
    // Empty Placeholder Fill
    ctx.fillStyle = 'rgba(1, 32, 17, 0.95)';
    ctx.fillRect(imgBoxX, imgBoxY, imgBoxSize, imgBoxSize);

    // Vector Glowing Upload Icon (Upward Arrow Tray)
    const iconCx = WIDTH / 2;
    const iconCy = imgBoxY + imgBoxSize / 2 - 28;

    ctx.save();
    ctx.shadowColor = 'rgba(254, 225, 1, 0.85)';
    ctx.shadowBlur = 22;
    ctx.strokeStyle = COLOR_YELLOW;
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Tray base
    ctx.beginPath();
    ctx.moveTo(iconCx - 40, iconCy + 14);
    ctx.lineTo(iconCx - 40, iconCy + 35);
    ctx.lineTo(iconCx + 40, iconCy + 35);
    ctx.lineTo(iconCx + 40, iconCy + 14);
    ctx.stroke();

    // Upward Stem
    ctx.beginPath();
    ctx.moveTo(iconCx, iconCy + 20);
    ctx.lineTo(iconCx, iconCy - 30);
    ctx.stroke();

    // Arrow Head
    ctx.beginPath();
    ctx.moveTo(iconCx - 24, iconCy - 8);
    ctx.lineTo(iconCx, iconCy - 30);
    ctx.lineTo(iconCx + 24, iconCy - 8);
    ctx.stroke();
    ctx.restore();

    // Glowing Yellow Upload Text
    ctx.save();
    ctx.shadowColor = 'rgba(254, 225, 1, 0.85)';
    ctx.shadowBlur = 20;
    ctx.fillStyle = COLOR_YELLOW;
    ctx.font = '800 26px "Space Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('UPLOAD PHOTO', WIDTH / 2, imgBoxY + imgBoxSize / 2 + 55);
    ctx.restore();
  }
  ctx.restore();

  // Accent Stars at Corners of Photo Frame
  ctx.fillStyle = COLOR_PINK;
  ctx.font = '26px sans-serif';
  ctx.fillText('✦', imgBoxX - 25, imgBoxY + 12);
  ctx.fillText('✦', imgBoxX + imgBoxSize + 25, imgBoxY + 12);

  // ==========================================
  // 4. OTHER DETAILS: GLOWING PINK (GOA STYLE)
  // ==========================================

  // --- A. USER NAME BANNER (Y: 725 to 810) ---
  const nameY = 725;
  const nameW = 780;
  const nameH = 85;
  const nameX = (WIDTH - nameW) / 2;

  ctx.save();
  ctx.beginPath();
  pathRoundRect(ctx, nameX, nameY, nameW, nameH, 24);
  ctx.fillStyle = 'rgba(1, 24, 12, 0.88)';
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = COLOR_YELLOW;
  ctx.stroke();

  // Stars
  ctx.fillStyle = COLOR_YELLOW;
  ctx.font = '30px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('✦', nameX + 38, nameY + 53);
  ctx.fillText('✦', nameX + nameW - 38, nameY + 53);

  // Name in Glowing Pink
  ctx.shadowColor = 'rgba(255, 0, 122, 0.95)';
  ctx.shadowBlur = 30;
  ctx.fillStyle = COLOR_PINK;
  ctx.font = '800 44px "Space Mono", monospace';
  ctx.fillText(displayUserName, WIDTH / 2, nameY + 57);
  ctx.restore();

  // --- B. ROLE / STACK BADGE (Y: 828 to 884) ---
  const roleY = 828;
  const roleW = 700;
  const roleH = 56;
  const roleX = (WIDTH - roleW) / 2;

  ctx.save();
  ctx.beginPath();
  pathRoundRect(ctx, roleX, roleY, roleW, roleH, 28);
  ctx.fillStyle = 'rgba(255, 0, 122, 0.14)';
  ctx.fill();
  ctx.lineWidth = 2.5;
  ctx.strokeStyle = 'rgba(255, 0, 122, 0.65)';
  ctx.stroke();

  ctx.shadowColor = 'rgba(255, 0, 122, 0.9)';
  ctx.shadowBlur = 24;
  ctx.fillStyle = COLOR_PINK;
  ctx.font = '800 24px "Space Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText(`⚡ ${displayRole} ⚡`, WIDTH / 2, roleY + 36);
  ctx.restore();

  // --- C. BUILDER CLASS / TITLE TAG (Y: 900 to 948) ---
  const titleY = 900;
  const titleW = 580;
  const titleH = 48;
  const titleX = (WIDTH - titleW) / 2;

  ctx.save();
  ctx.beginPath();
  pathRoundRect(ctx, titleX, titleY, titleW, titleH, 24);
  ctx.fillStyle = 'rgba(1, 30, 15, 0.8)';
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = 'rgba(254, 225, 1, 0.35)';
  ctx.stroke();

  ctx.shadowColor = 'rgba(255, 0, 122, 0.85)';
  ctx.shadowBlur = 20;
  ctx.fillStyle = COLOR_PINK;
  ctx.font = '800 20px "Space Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText(`✦ ${displayTitle} ✦`, WIDTH / 2, titleY + 31);
  ctx.restore();

  // --- D. 4 AUTO-GENERATED TRAITS BADGES (Y: 964 to 1064) ---
  const defaultTraits = ['Terminal Resident', 'Async Specialist', 'Clean Code Fanatic', 'UI Perfectionist'];
  const displayTraits = (params.traits && params.traits.length >= 4) ? params.traits.slice(0, 4) : defaultTraits;

  const traitsStartY = 964;
  const traitPillW = 365;
  const traitPillH = 44;
  const traitGapX = 20;
  const traitGapY = 12;

  const col1X = (WIDTH - (traitPillW * 2 + traitGapX)) / 2; // 137
  const col2X = col1X + traitPillW + traitGapX; // 522

  displayTraits.forEach((trait, i) => {
    const row = Math.floor(i / 2);
    const col = i % 2;
    const px = col === 0 ? col1X : col2X;
    const py = traitsStartY + row * (traitPillH + traitGapY);

    ctx.save();
    ctx.beginPath();
    pathRoundRect(ctx, px, py, traitPillW, traitPillH, 22);
    ctx.fillStyle = 'rgba(255, 0, 122, 0.12)';
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgba(255, 0, 122, 0.55)';
    ctx.stroke();

    ctx.shadowColor = 'rgba(255, 0, 122, 0.9)';
    ctx.shadowBlur = 18;
    ctx.fillStyle = COLOR_PINK;
    ctx.font = '800 16px "Space Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`✦ ${trait.toUpperCase()}`, px + traitPillW / 2, py + 28);
    ctx.restore();
  });

  // ==========================================
  // 5. BARCODE SECTION (Y: 1095 to 1305)
  // ==========================================
  const bcContainerY = 1095;
  const bcContainerH = 210;
  const bcContainerW = 780;
  const bcContainerX = (WIDTH - bcContainerW) / 2;

  ctx.save();
  ctx.beginPath();
  pathRoundRect(ctx, bcContainerX, bcContainerY, bcContainerW, bcContainerH, 24);
  ctx.fillStyle = COLOR_CREAM;
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = COLOR_YELLOW;
  ctx.stroke();

  // Builder ID Text
  ctx.fillStyle = COLOR_GREEN_BG;
  ctx.font = '800 26px "Space Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText(`BUILDER ID: #${passId}`, WIDTH / 2, bcContainerY + 44);

  // Barcode Render
  const bcX = WIDTH / 2 - 260;
  const bcY = bcContainerY + 58;
  const bcH = 85;
  ctx.fillStyle = COLOR_GREEN_DEEP;

  // Patterned Barcode Bars
  for (let b = 0; b < 520; b += 8) {
    const barWidth = b % 16 === 0 ? 5 : b % 24 === 0 ? 6 : 3;
    ctx.fillRect(bcX + b, bcY, barWidth, bcH);
  }

  // Barcode ID subtext
  ctx.fillStyle = COLOR_GREEN_DARK;
  ctx.font = '700 16px "Space Mono", monospace';
  ctx.fillText(`* ${passId} *`, WIDTH / 2, bcContainerY + 178);
  ctx.restore();

  // ==========================================
  // 6. BOTTOM HASHTAG BANNER & FOOTER (Y: 1332 to 1462)
  // ==========================================
  const bannerY = 1332;
  const bannerW = 640;
  const bannerH = 70;
  const bannerX = (WIDTH - bannerW) / 2;

  ctx.save();
  ctx.beginPath();
  pathRoundRect(ctx, bannerX, bannerY, bannerW, bannerH, 35);
  ctx.fillStyle = 'rgba(255, 0, 122, 0.16)';
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = COLOR_PINK;
  ctx.stroke();

  ctx.shadowColor = 'rgba(255, 0, 122, 0.95)';
  ctx.shadowBlur = 28;
  ctx.fillStyle = COLOR_PINK;
  ctx.font = '800 32px "Space Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('✦ #FRAMEINGOA ✦', WIDTH / 2, bannerY + 46);
  ctx.restore();

  // Footer Tagline
  ctx.fillStyle = COLOR_YELLOW;
  ctx.font = '700 16px "Space Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('HH GOA 2026 • 2:47 PM STUDIO', WIDTH / 2, 1462);
}
