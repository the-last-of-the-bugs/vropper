export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/**
 * Size of the axis-aligned bounding box of a rotated rectangle.
 * Used so a rotated image still covers the whole crop box.
 */
export function rotatedBounds(width: number, height: number, degrees: number) {
  const rad = toRadians(degrees);
  const sin = Math.abs(Math.sin(rad));
  const cos = Math.abs(Math.cos(rad));
  return {
    width: width * cos + height * sin,
    height: width * sin + height * cos,
  };
}

/**
 * Base scale so the (possibly rotated) image fully covers the crop box.
 */
export function coverScale(
  imageWidth: number,
  imageHeight: number,
  boxWidth: number,
  boxHeight: number,
  rotation: number,
): number {
  const bounds = rotatedBounds(imageWidth, imageHeight, rotation);
  return Math.max(boxWidth / bounds.width, boxHeight / bounds.height);
}
