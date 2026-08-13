import type { ExportFormat, ExportOptions, ExportResult } from "../types";

const extensions: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/avif": "avif",
};

export function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: ExportFormat,
  quality?: number,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Vropper: canvas export failed"));
      },
      type,
      quality,
    );
  });
}

export async function exportCanvas(
  canvas: HTMLCanvasElement,
  options: ExportOptions = {},
): Promise<ExportResult> {
  const type = options.type ?? "image/png";
  const blob = await canvasToBlob(canvas, type, options.quality ?? 0.92);
  const name = options.fileName ?? `vropper.${extensions[type] ?? "png"}`;
  const file = new File([blob], name, { type: blob.type });

  return {
    blob,
    file,
    url: URL.createObjectURL(blob),
    width: canvas.width,
    height: canvas.height,
    type: blob.type,
  };
}
