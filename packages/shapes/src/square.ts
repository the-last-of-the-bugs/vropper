import type { ShapeDefinition } from "./types";

export const square: ShapeDefinition = {
  id: "square",
  label: "Square",
  path: (ctx, x, y, w, h) => {
    ctx.rect(x, y, w, h);
  },
};
