import type { ShapeDefinition } from "./types";

export const circle: ShapeDefinition = {
  id: "circle",
  label: "Circle",
  path: (ctx, x, y, w, h) => {
    ctx.ellipse(x + w / 2, y + h / 2, w / 2, h / 2, 0, 0, Math.PI * 2);
    ctx.closePath();
  },
};
