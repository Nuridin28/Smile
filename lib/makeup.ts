import type { Landmark } from "./face";

// MediaPipe Face Mesh landmark indices for lips
const LIPS_OUTER = [
  61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291, 409, 270, 269, 267, 0, 37, 39, 40, 185
];
const LIPS_INNER = [
  78, 95, 88, 178, 87, 14, 317, 402, 318, 324, 308, 415, 310, 311, 312, 13, 82, 81, 80, 191
];

// Eyelid centers (top of iris ~159 / 386). We draw a soft ellipse above each eye.
const LEFT_EYE_TOP = 159;
const RIGHT_EYE_TOP = 386;

// Cheek apple approximations (over the cheekbone, below eye)
const LEFT_CHEEK = 50;
const RIGHT_CHEEK = 280;

function pt(lm: Landmark[], i: number, w: number, h: number) {
  const p = lm[i];
  return { x: p.x * w, y: p.y * h };
}

function pathPolygon(ctx: CanvasRenderingContext2D, lm: Landmark[], indices: number[], w: number, h: number) {
  indices.forEach((idx, i) => {
    const p = pt(lm, idx, w, h);
    if (i === 0) ctx.moveTo(p.x, p.y);
    else ctx.lineTo(p.x, p.y);
  });
  ctx.closePath();
}

export function drawLips(
  ctx: CanvasRenderingContext2D,
  lm: Landmark[],
  color: string,
  w: number,
  h: number
) {
  ctx.save();
  ctx.globalCompositeOperation = "multiply";
  ctx.globalAlpha = 0.7;
  ctx.fillStyle = color;
  ctx.beginPath();
  pathPolygon(ctx, lm, LIPS_OUTER, w, h);
  pathPolygon(ctx, lm, LIPS_INNER, w, h);
  ctx.fill("evenodd");
  ctx.restore();

  // Subtle glossy highlight on top of upper lip
  ctx.save();
  ctx.globalCompositeOperation = "soft-light";
  ctx.globalAlpha = 0.35;
  ctx.fillStyle = "#ffffff";
  const top = pt(lm, 0, w, h);
  const left = pt(lm, 61, w, h);
  const right = pt(lm, 291, w, h);
  const lipW = right.x - left.x;
  const grd = ctx.createLinearGradient(top.x, top.y - lipW * 0.12, top.x, top.y + lipW * 0.05);
  grd.addColorStop(0, "rgba(255,255,255,0.6)");
  grd.addColorStop(1, "rgba(255,255,255,0)");
  ctx.beginPath();
  pathPolygon(ctx, lm, LIPS_OUTER, w, h);
  pathPolygon(ctx, lm, LIPS_INNER, w, h);
  ctx.fillStyle = grd;
  ctx.fill("evenodd");
  ctx.restore();
}

export function drawEyeshadow(
  ctx: CanvasRenderingContext2D,
  lm: Landmark[],
  color: string,
  w: number,
  h: number
) {
  ctx.save();
  ctx.globalCompositeOperation = "multiply";
  ctx.globalAlpha = 0.55;

  for (const idx of [LEFT_EYE_TOP, RIGHT_EYE_TOP]) {
    const c = pt(lm, idx, w, h);
    const cy = c.y - h * 0.012; // shift slightly above the iris
    const rx = w * 0.055;
    const ry = h * 0.025;

    const grd = ctx.createRadialGradient(c.x, cy, 0, c.x, cy, rx);
    grd.addColorStop(0, color);
    grd.addColorStop(0.55, withAlpha(color, 0.6));
    grd.addColorStop(1, withAlpha(color, 0));

    ctx.save();
    ctx.translate(c.x, cy);
    ctx.scale(1, ry / rx);
    ctx.translate(-c.x, -cy);
    ctx.fillStyle = grd;
    ctx.fillRect(c.x - rx * 1.4, cy - rx, rx * 2.8, rx * 2);
    ctx.restore();
  }
  ctx.restore();
}

export function drawBlush(
  ctx: CanvasRenderingContext2D,
  lm: Landmark[],
  color: string,
  w: number,
  h: number
) {
  ctx.save();
  ctx.globalCompositeOperation = "multiply";
  ctx.globalAlpha = 0.45;

  for (const idx of [LEFT_CHEEK, RIGHT_CHEEK]) {
    const c = pt(lm, idx, w, h);
    const r = w * 0.07;

    const grd = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, r);
    grd.addColorStop(0, color);
    grd.addColorStop(0.5, withAlpha(color, 0.55));
    grd.addColorStop(1, withAlpha(color, 0));

    ctx.fillStyle = grd;
    ctx.fillRect(c.x - r, c.y - r, r * 2, r * 2);
  }
  ctx.restore();
}

function withAlpha(hex: string, a: number): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

export type ZoneColors = {
  lips: string | null;
  eyes: string | null;
  cheeks: string | null;
};

export function paintMakeup(
  canvas: HTMLCanvasElement,
  lm: Landmark[],
  zones: ZoneColors
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (zones.cheeks) drawBlush(ctx, lm, zones.cheeks, canvas.width, canvas.height);
  if (zones.eyes) drawEyeshadow(ctx, lm, zones.eyes, canvas.width, canvas.height);
  if (zones.lips) drawLips(ctx, lm, zones.lips, canvas.width, canvas.height);
}
