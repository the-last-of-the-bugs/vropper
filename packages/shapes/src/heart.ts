import type { ShapeDefinition } from "./types";

/** Heart drawn with two bezier lobes, normalized to the given box. */
export const heart: ShapeDefinition = {
  id: "heart",
  label: "Heart",
  path: (ctx, x, y, w, h) => {
    const px = (u: number) => x + u * w;
    const py = (v: number) => y + v * h;

    ctx.moveTo(px(0.5), py(1));
    ctx.bezierCurveTo(px(-0.08), py(0.62), px(0.06), py(0.02), px(0.5), py(0.26));
    ctx.bezierCurveTo(px(0.94), py(0.02), px(1.08), py(0.62), px(0.5), py(1));
    ctx.closePath();
  },
};
