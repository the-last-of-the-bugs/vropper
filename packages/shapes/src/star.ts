import type { ShapeDefinition } from "./types";

export const star: ShapeDefinition = {
  id: "star",
  label: "Star",
  path: (ctx, x, y, w, h, options) => {
    const points = Math.max(3, Math.round(options?.points ?? 5));
    const innerRatio = Math.min(Math.max(options?.innerRatio ?? 0.45, 0.05), 0.95);
    const cx = x + w / 2;
    const cy = y + h / 2;
    const outerX = w / 2;
    const outerY = h / 2;
    const step = Math.PI / points;

    for (let i = 0; i < points * 2; i += 1) {
      const scale = i % 2 === 0 ? 1 : innerRatio;
      const angle = i * step - Math.PI / 2;
      const px = cx + Math.cos(angle) * outerX * scale;
      const py = cy + Math.sin(angle) * outerY * scale;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
  },
};
