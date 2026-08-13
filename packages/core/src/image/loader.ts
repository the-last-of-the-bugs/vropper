import type { ImageSource } from "../types";

/** Load any supported image source into a drawable HTMLImageElement. */
export async function loadImage(source: ImageSource): Promise<HTMLImageElement> {
  if (typeof HTMLImageElement !== "undefined" && source instanceof HTMLImageElement) {
    if (source.complete && source.naturalWidth > 0) return source;
    return decodeFromUrl(source.src);
  }

  if (typeof ImageBitmap !== "undefined" && source instanceof ImageBitmap) {
    const canvas = document.createElement("canvas");
    canvas.width = source.width;
    canvas.height = source.height;
    canvas.getContext("2d")?.drawImage(source, 0, 0);
    return decodeFromUrl(canvas.toDataURL());
  }

  if (typeof Blob !== "undefined" && source instanceof Blob) {
    const url = URL.createObjectURL(source);
    try {
      return await decodeFromUrl(url);
    } finally {
      // The decoded bitmap is retained by the element; the URL can go.
      setTimeout(() => URL.revokeObjectURL(url), 0);
    }
  }

  return decodeFromUrl(source as string);
}

function decodeFromUrl(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.decoding = "async";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Vropper: failed to load image "${url}"`));
    img.src = url;
  });
}
