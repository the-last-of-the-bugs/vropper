import { clipToShape, traceShape } from "../shape/mask";
import { coverScale, toRadians } from "../transform/geometry";
import type { CropperState, Rect, Size } from "../types";

export interface RenderParams {
  image: HTMLImageElement;
  state: CropperState;
  cropBox: Rect;
  viewport: Size;
  /** Draw dimmed backdrop + shape outline (preview only). */
  chrome?: boolean | undefined;
  backdrop?: string | undefined;
  outline?: string | undefined;
  background?: string | undefined;
}

/**
 * Draw the image with the current transform. The same math powers both the
 * interactive preview and the final export, so what you see is what you get.
 */
export function drawImageLayer(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  state: CropperState,
  cropBox: Rect,
): void {
  const base = coverScale(
    image.naturalWidth,
    image.naturalHeight,
    cropBox.width,
    cropBox.height,
    state.rotation,
  );
  const scale = base * state.zoom;

  ctx.save();
  ctx.translate(cropBox.x + cropBox.width / 2 + state.offset.x, cropBox.y + cropBox.height / 2 + state.offset.y);
  ctx.rotate(toRadians(state.rotation));
  ctx.scale(state.flipX ? -scale : scale, state.flipY ? -scale : scale);
  ctx.drawImage(image, -image.naturalWidth / 2, -image.naturalHeight / 2);
  ctx.restore();
}

/** Full preview render: masked image, dimmed surroundings, shape outline. */
export function renderPreview(ctx: CanvasRenderingContext2D, params: RenderParams): void {
  const { image, state, cropBox, viewport } = params;

  ctx.clearRect(0, 0, viewport.width, viewport.height);

  // Dimmed, unmasked image behind the crop area for context.
  if (params.chrome !== false) {
    ctx.save();
    ctx.globalAlpha = 0.28;
    drawImageLayer(ctx, image, state, cropBox);
    ctx.restore();

    ctx.save();
    ctx.fillStyle = params.backdrop ?? "rgba(0,0,0,0.45)";
    ctx.fillRect(0, 0, viewport.width, viewport.height);
    ctx.restore();
  }

  ctx.save();
  clipToShape(ctx, state.shape, cropBox, state.shapeOptions);
  if (params.background) {
    ctx.fillStyle = params.background;
    ctx.fillRect(cropBox.x, cropBox.y, cropBox.width, cropBox.height);
  }
  drawImageLayer(ctx, image, state, cropBox);
  ctx.restore();

  if (params.chrome !== false) {
    ctx.save();
    ctx.beginPath();
    traceShape(ctx, state.shape, cropBox, state.shapeOptions);
    ctx.strokeStyle = params.outline ?? "rgba(255,255,255,0.9)";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
  }
}

/** Offscreen render used for export at an arbitrary output size. */
export function renderExport(params: {
  image: HTMLImageElement;
  state: CropperState;
  cropBox: Rect;
  width: number;
  height: number;
  masked?: boolean | undefined;
  background?: string | undefined;
}): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(params.width));
  canvas.height = Math.max(1, Math.round(params.height));
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Vropper: 2D context unavailable");

  const scaleX = canvas.width / params.cropBox.width;
  const scaleY = canvas.height / params.cropBox.height;

  if (params.background) {
    ctx.fillStyle = params.background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  ctx.save();
  ctx.scale(scaleX, scaleY);
  ctx.translate(-params.cropBox.x, -params.cropBox.y);

  const localBox = { ...params.cropBox };
  if (params.masked !== false) {
    clipToShape(ctx, params.state.shape, localBox, params.state.shapeOptions);
  }
  drawImageLayer(ctx, params.image, params.state, localBox);
  ctx.restore();

  return canvas;
}
