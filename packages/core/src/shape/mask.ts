import { defaultShapeRegistry, type ShapeContext, type ShapeId } from "@vropper/shapes";
import type { Rect } from "../types";

/** Trace the active shape into the current path of ctx (or a Path2D). */
export function traceShape(
  ctx: CanvasRenderingContext2D | Path2D,
  shape: ShapeId,
  rect: Rect,
  options?: ShapeContext,
  registry = defaultShapeRegistry,
): void {
  registry.get(shape).path(ctx, rect.x, rect.y, rect.width, rect.height, options);
}

/** Clip subsequent drawing to the shape. */
export function clipToShape(
  ctx: CanvasRenderingContext2D,
  shape: ShapeId,
  rect: Rect,
  options?: ShapeContext,
  registry = defaultShapeRegistry,
): void {
  ctx.beginPath();
  traceShape(ctx, shape, rect, options, registry);
  ctx.clip();
}
