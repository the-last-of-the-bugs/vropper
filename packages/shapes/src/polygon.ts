import type { ShapeDefinition } from "./types";

const regular = (id: string, label: string, sides: number, rotation: number): ShapeDefinition => ({
  id,
  label,
  path: (ctx, x, y, w, h) => {
    const cx = x + w / 2;
    const cy = y + h / 2;
    for (let i = 0; i < sides; i += 1) {
      const angle = (i / sides) * Math.PI * 2 + rotation;
      const pxx = cx + (Math.cos(angle) * w) / 2;
      const pyy = cy + (Math.sin(angle) * h) / 2;
      if (i === 0) ctx.moveTo(pxx, pyy);
      else ctx.lineTo(pxx, pyy);
    }
    ctx.closePath();
  },
});

export const hexagon = regular("hexagon", "Hexagon", 6, -Math.PI / 2);
export const triangle = regular("triangle", "Triangle", 3, -Math.PI / 2);
export const diamond = regular("diamond", "Diamond", 4, -Math.PI / 2);
