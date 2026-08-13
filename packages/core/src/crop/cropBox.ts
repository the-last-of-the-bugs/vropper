import type { AspectRatio, Size } from "../types";

/**
 * Fit a crop box with the requested aspect ratio inside the viewport,
 * leaving a small padding so handles stay reachable.
 */
export function computeCropBox(
  viewport: Size,
  aspectRatio: AspectRatio,
  padding = 24,
): Size & { x: number; y: number } {
  const availableWidth = Math.max(viewport.width - padding * 2, 1);
  const availableHeight = Math.max(viewport.height - padding * 2, 1);

  let width = availableWidth;
  let height = availableHeight;

  if (aspectRatio !== "free" && Number.isFinite(aspectRatio) && aspectRatio > 0) {
    if (availableWidth / availableHeight > aspectRatio) {
      height = availableHeight;
      width = height * aspectRatio;
    } else {
      width = availableWidth;
      height = width / aspectRatio;
    }
  }

  return {
    width,
    height,
    x: (viewport.width - width) / 2,
    y: (viewport.height - height) / 2,
  };
}
