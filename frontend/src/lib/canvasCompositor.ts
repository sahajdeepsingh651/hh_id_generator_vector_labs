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

export function drawCompositeCanvas(
  canvas: HTMLCanvasElement,
  params: CompositeParams
) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const WIDTH = 1024;
  const HEIGHT = 1536;

  // Canvas aspect ratio 1024 / 1536 (2:3)
  canvas.width = WIDTH;
  canvas.height = HEIGHT;

  // Exact Palette
  const COLOR_CREAM = '#FFF8EB';
  const COLOR_GREEN_DARK = '#026834';
  const COLOR_YELLOW = '#FEE101';
  const COLOR_PINK = '#FF007A';
  const COLOR_RED = '#E52B50';
  const COLOR_DARK = '#063725';
  const COLOR_WHITE = '#FFFFFF';

  const passId = params.passId || `HH-GOA-${Math.floor(1000 + Math.random() * 9000)}`;

  // 1. Background Canvas
  ctx.fillStyle = COLOR_CREAM;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // Outer Border Frame
  const bw = 32;
  ctx.fillStyle = COLOR_GREEN_DARK;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  ctx.fillStyle = COLOR_CREAM;
  ctx.fillRect(bw, bw, WIDTH - bw * 2, HEIGHT - bw * 2);
  ctx.lineWidth = 4;
  ctx.strokeStyle = COLOR_DARK;
  ctx.strokeRect(bw, bw, WIDTH - bw * 2, HEIGHT - bw * 2);

  // 2. Illustrated Header & Tropical Motifs (Sun, Palms, Goan Cottage, Scooter, Surfboards)
  // Top Banner
  const topY = 75;
  ctx.fillStyle = COLOR_GREEN_DARK;
  ctx.fillRect(bw + 10, topY, WIDTH - bw * 2 - 20, 110);
  ctx.lineWidth = 4;
  ctx.strokeStyle = COLOR_YELLOW;
  ctx.strokeRect(bw + 10, topY, WIDTH - bw * 2 - 20, 110);

  // Title: HACKER GOA HOUSE
  ctx.fillStyle = COLOR_YELLOW;
  ctx.font = '900 48px "Playfair Display", "Cinzel Decorative", serif';
  ctx.textAlign = 'center';
  ctx.fillText('HACKER HOUSE', WIDTH / 2 - 45, topY + 55);

  // Cursive Hindi "गोवा" Overlay
  ctx.fillStyle = COLOR_PINK;
  ctx.font = '900 42px "Rozha One", serif';
  ctx.shadowColor = COLOR_YELLOW;
  ctx.shadowBlur = 10;
  ctx.fillText('गोवा', WIDTH / 2 + 195, topY + 50);
  ctx.shadowBlur = 0;

  // Subtitle: Builder Social Card Generator
  ctx.fillStyle = COLOR_CREAM;
  ctx.font = '700 20px "Space Mono", monospace';
  ctx.fillText('BUILDER SOCIAL CARD GENERATOR • 2026', WIDTH / 2, topY + 95);

  // Decorative Goan Beach Scene Background
  const sceneY = 210;
  ctx.fillStyle = '#FFEAA7';
  ctx.fillRect(bw + 10, sceneY, WIDTH - bw * 2 - 20, 430);

  // Sun Graphic
  ctx.fillStyle = COLOR_RED;
  ctx.beginPath();
  ctx.arc(WIDTH / 2, sceneY + 120, 75, 0, Math.PI * 2);
  ctx.fill();

  // Tropical Trees & Cottage Illustration Accents
  ctx.fillStyle = COLOR_GREEN_DARK;
  ctx.font = '54px sans-serif';
  ctx.fillText('🌴', bw + 70, sceneY + 160);
  ctx.fillText('🌴', WIDTH - bw - 110, sceneY + 160);
  ctx.fillText('🛵', WIDTH - bw - 180, sceneY + 360);
  ctx.fillText('🏠', WIDTH - bw - 90, sceneY + 350);
  ctx.fillText('🏄‍♂️', bw + 80, sceneY + 360);
  ctx.fillText('⛵', bw + 150, sceneY + 340);

  // Signposts: "SHIP" and "REPEAT"
  ctx.fillStyle = COLOR_PINK;
  ctx.fillRect(bw + 40, sceneY + 40, 110, 36);
  ctx.fillStyle = COLOR_WHITE;
  ctx.font = '700 18px "Space Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('SHIP', bw + 95, sceneY + 65);

  ctx.fillStyle = COLOR_GREEN_DARK;
  ctx.fillRect(bw + 40, sceneY + 86, 110, 36);
  ctx.fillStyle = COLOR_WHITE;
  ctx.fillText('REPEAT', bw + 95, sceneY + 111);

  // 3. Photo Window (Circular Cutout with Dashed Yellow/Red Outer Ring)
  const photoCx = WIDTH / 2;
  const photoCy = sceneY + 220;
  const photoRadius = 160;

  // Dashed Ring Outer Border
  ctx.save();
  ctx.lineWidth = 14;
  ctx.strokeStyle = COLOR_YELLOW;
  ctx.setLineDash([20, 14]);
  ctx.beginPath();
  ctx.arc(photoCx, photoCy, photoRadius + 10, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  // Circular Photo Clipping
  ctx.save();
  ctx.beginPath();
  ctx.arc(photoCx, photoCy, photoRadius, 0, Math.PI * 2);
  ctx.clip();

  if (params.photoImage) {
    if (params.cropAreaPixels) {
      const { x, y, width, height } = params.cropAreaPixels;
      ctx.drawImage(
        params.photoImage,
        x, y, width, height,
        photoCx - photoRadius, photoCy - photoRadius, photoRadius * 2, photoRadius * 2
      );
    } else {
      const imgAspect = params.photoImage.width / params.photoImage.height;
      let renderW = photoRadius * 2;
      let renderH = photoRadius * 2;
      if (imgAspect > 1) {
        renderW = photoRadius * 2 * imgAspect;
      } else {
        renderH = (photoRadius * 2) / imgAspect;
      }
      ctx.drawImage(
        params.photoImage,
        photoCx - renderW / 2, photoCy - renderH / 2, renderW, renderH
      );
    }
  } else {
    ctx.fillStyle = '#E6E1D3';
    ctx.fillRect(photoCx - photoRadius, photoCy - photoRadius, photoRadius * 2, photoRadius * 2);
    ctx.fillStyle = COLOR_GREEN_DARK;
    ctx.font = '700 24px "Space Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('UPLOAD PHOTO', photoCx, photoCy);
  }
  ctx.restore();

  // Solid Inner Ring Stroke
  ctx.lineWidth = 6;
  ctx.strokeStyle = COLOR_GREEN_DARK;
  ctx.beginPath();
  ctx.arc(photoCx, photoCy, photoRadius + 2, 0, Math.PI * 2);
  ctx.stroke();

  // 4. Name Tag Plaque Banner
  const nameY = 660;
  const nameW = 680;
  const nameH = 80;
  const nameX = (WIDTH - nameW) / 2;

  ctx.fillStyle = COLOR_GREEN_DARK;
  ctx.fillRect(nameX, nameY, nameW, nameH);
  ctx.lineWidth = 4;
  ctx.strokeStyle = COLOR_YELLOW;
  ctx.strokeRect(nameX, nameY, nameW, nameH);

  // Star Accents
  ctx.fillStyle = COLOR_YELLOW;
  ctx.font = '28px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('✦', nameX + 30, nameY + 50);
  ctx.fillText('✦', nameX + nameW - 30, nameY + 50);

  // Name Text
  ctx.fillStyle = COLOR_WHITE;
  ctx.font = '800 42px "Space Mono", monospace';
  const nameText = (params.userName || 'YOUR NAME').toUpperCase();
  ctx.fillText(nameText, WIDTH / 2, nameY + 55);

  // 5. Stack / Role Tag Banner
  const roleY = 760;
  const roleW = 540;
  const roleH = 60;
  const roleX = (WIDTH - roleW) / 2;

  ctx.fillStyle = COLOR_YELLOW;
  ctx.fillRect(roleX, roleY, roleW, roleH);
  ctx.lineWidth = 3;
  ctx.strokeStyle = COLOR_GREEN_DARK;
  ctx.strokeRect(roleX, roleY, roleW, roleH);

  ctx.fillStyle = COLOR_RED;
  ctx.font = '800 26px "Space Mono", monospace';
  const roleText = (params.stackRole || 'FRONTEND / UI DESIGNER').toUpperCase();
  ctx.fillText(`⚡ ${roleText} ⚡`, WIDTH / 2, roleY + 41);

  // 6. 3-Column Stats & Info Grid
  const gridY = 860;
  const gridH = 380;
  const gridW = WIDTH - bw * 2 - 40;
  const gridX = bw + 20;

  ctx.fillStyle = COLOR_CREAM;
  ctx.fillRect(gridX, gridY, gridW, gridH);
  ctx.lineWidth = 3;
  ctx.strokeStyle = COLOR_GREEN_DARK;
  ctx.strokeRect(gridX, gridY, gridW, gridH);

  // Column Dividers
  const col1W = 280;
  const col2W = 340;
  ctx.beginPath();
  ctx.moveTo(gridX + col1W, gridY);
  ctx.lineTo(gridX + col1W, gridY + gridH);
  ctx.moveTo(gridX + col1W + col2W, gridY);
  ctx.lineTo(gridX + col1W + col2W, gridY + gridH);
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#D1CBB9';
  ctx.stroke();

  // Column 1: BUILDER CLASS & QR Code
  ctx.fillStyle = COLOR_RED;
  ctx.font = '800 18px "Space Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('✦ BUILDER CLASS ✦', gridX + col1W / 2, gridY + 40);

  ctx.fillStyle = COLOR_GREEN_DARK;
  ctx.font = '800 22px "Space Mono", monospace';
  ctx.fillText((params.builderTitle || 'TERMINAL WIZARD').toUpperCase(), gridX + col1W / 2, gridY + 80);

  // QR Code Box Representation
  const qrX = gridX + 50;
  const qrY = gridY + 120;
  const qrSize = 180;
  ctx.fillStyle = COLOR_WHITE;
  ctx.fillRect(qrX, qrY, qrSize, qrSize);
  ctx.lineWidth = 3;
  ctx.strokeStyle = COLOR_GREEN_DARK;
  ctx.strokeRect(qrX, qrY, qrSize, qrSize);

  // Draw QR Modules Pattern
  ctx.fillStyle = COLOR_GREEN_DARK;
  for (let r = 0; r < 6; r++) {
    for (let c = 0; c < 6; c++) {
      if ((r + c) % 2 === 0 || (r * c) % 3 === 0) {
        ctx.fillRect(qrX + 15 + c * 25, qrY + 15 + r * 25, 20, 20);
      }
    }
  }
  // Center Palm Tree in QR
  ctx.font = '32px sans-serif';
  ctx.fillText('🌴', qrX + qrSize / 2, qrY + qrSize / 2 + 10);

  // Column 2: BEACH BAG List
  const col2X = gridX + col1W + col2W / 2;
  ctx.fillStyle = COLOR_RED;
  ctx.font = '800 18px "Space Mono", monospace';
  ctx.fillText('✦ BEACH BAG ✦', col2X, gridY + 40);

  const beachItems = [
    { icon: '🥥', label: 'COCONUT' },
    { icon: '💻', label: 'VS CODE' },
    { icon: '🎧', label: 'LO-FI BEATS' },
  ];

  beachItems.forEach((item, i) => {
    const iy = gridY + 110 + i * 80;
    ctx.font = '32px sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(item.icon, col2X - 20, iy);

    ctx.fillStyle = COLOR_GREEN_DARK;
    ctx.font = '800 20px "Space Mono", monospace';
    ctx.textAlign = 'left';
    ctx.fillText(item.label, col2X, iy - 6);
  });

  // Column 3: CURRENTLY SHIPPING & Barcode
  const col3X = gridX + col1W + col2W + (gridW - col1W - col2W) / 2;
  ctx.fillStyle = COLOR_RED;
  ctx.font = '800 18px "Space Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('✦ CURRENTLY SHIPPING ✦', col3X, gridY + 40);

  ctx.fillStyle = COLOR_GREEN_DARK;
  ctx.font = '800 20px "Space Mono", monospace';
  ctx.fillText('BUILDING THE', col3X, gridY + 80);
  ctx.fillText('FUTURE', col3X, gridY + 110);

  ctx.fillStyle = '#718096';
  ctx.font = '700 16px "Space Mono", monospace';
  ctx.fillText('BUILDER ID', col3X, gridY + 175);

  ctx.fillStyle = COLOR_GREEN_DARK;
  ctx.font = '800 22px "Space Mono", monospace';
  ctx.fillText(`#${passId}`, col3X, gridY + 205);

  // Barcode
  const bcX = col3X - 90;
  const bcY = gridY + 230;
  ctx.fillStyle = COLOR_DARK;
  for (let b = 0; b < 180; b += 6) {
    const bw = b % 12 === 0 ? 4 : 2;
    ctx.fillRect(bcX + b, bcY, bw, 65);
  }

  // 7. Bottom Pink Hashtag Banner
  const bannerY = 1270;
  const bannerH = 70;
  const bannerW = gridW;
  const bannerX = gridX;

  ctx.fillStyle = COLOR_PINK;
  ctx.fillRect(bannerX, bannerY, bannerW, bannerH);
  ctx.lineWidth = 3;
  ctx.strokeStyle = COLOR_YELLOW;
  ctx.strokeRect(bannerX, bannerY, bannerW, bannerH);

  ctx.fillStyle = COLOR_WHITE;
  ctx.font = '800 32px "Space Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('✦ #FRAMEINGOA ✦', WIDTH / 2, bannerY + 46);

  // 8. Footer Badge Pill
  const footY = 1370;
  const footW = 540;
  const footH = 60;
  const footX = (WIDTH - footW) / 2;

  ctx.beginPath();
  ctx.roundRect(footX, footY, footW, footH, 30);
  ctx.fillStyle = COLOR_YELLOW;
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = COLOR_GREEN_DARK;
  ctx.stroke();

  ctx.fillStyle = COLOR_DARK;
  ctx.font = '800 22px "Space Mono", monospace';
  ctx.fillText('BUILDER LEVEL: 100%', WIDTH / 2, footY + 38);
}
