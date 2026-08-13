import type { ShapeDefinition } from "./types";

/**
 * Rounded rectangle whose corner radius scales from 0 (square) to 1
 * (a full circle / pill depending on the box aspect ratio).
 */
export const rounded: ShapeDefinition = {
  id: "rounded",
  label: "Rounded",
  adjustableRadius: true,
  path: (ctx, x, y, w, h, options) => {
    const t = Math.min(Math.max(options?.radius ?? 0.25, 0), 1);
    const r = (Math.min(w, h) / 2) * t;

    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.arcTo(x + w, y, x + w, y + r, r);
    ctx.lineTo(x + w, y + h - r);
    ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
    ctx.lineTo(x + r, y + h);
    ctx.arcTo(x, y + h, x, y + h - r, r);
    ctx.lineTo(x, y + r);
    ctx.arcTo(x, y, x + r, y, r);
    ctx.closePath();
  },
};
