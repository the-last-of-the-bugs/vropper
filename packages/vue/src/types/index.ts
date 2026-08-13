import type { AspectRatio, CropperState, ExportFormat, ExportResult } from "@vropper/core";
import type { ShapeContext, ShapeId } from "@vropper/shapes";

export interface VropperProps {
  src: string | File | Blob;
  shape?: ShapeId;
  shapeOptions?: ShapeContext;
  aspectRatio?: AspectRatio;
  zoom?: { min?: number; max?: number; step?: number };
  rotation?: number;
  movable?: boolean;
  scalable?: boolean;
  rotatable?: boolean;
  flip?: boolean;
  background?: string;
  output?: { type?: ExportFormat; quality?: number; width?: number; height?: number };
}

export interface VropperEmits {
  (event: "ready", payload: { width: number; height: number }): void;
  (event: "change", state: CropperState): void;
  (event: "crop", state: CropperState): void;
  (event: "rotate", state: CropperState): void;
  (event: "flip", state: CropperState): void;
  (event: "shape-change", state: CropperState): void;
  (event: "export", result: ExportResult): void;
  (event: "error", error: Error): void;
}
