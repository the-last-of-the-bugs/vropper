import type { ShapeContext, ShapeId } from "@vropper/shapes";

export type ImageSource = string | File | Blob | HTMLImageElement | ImageBitmap;

export type ExportFormat = "image/png" | "image/jpeg" | "image/webp" | "image/avif";

export type AspectRatio = number | "free";

export interface Point {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface Rect extends Point, Size {}

export interface ZoomOptions {
  min?: number;
  max?: number;
  step?: number;
}

export interface CropperState {
  /** Pan offset of the image relative to the crop box center, in view px. */
  offset: Point;
  /** Scale multiplier applied on top of the cover-fit base scale. */
  zoom: number;
  /** Rotation in degrees. */
  rotation: number;
  flipX: boolean;
  flipY: boolean;
  shape: ShapeId;
  shapeOptions: ShapeContext;
  aspectRatio: AspectRatio;
}

export interface CropperOptions {
  src?: ImageSource;
  shape?: ShapeId;
  shapeOptions?: ShapeContext;
  aspectRatio?: AspectRatio;
  zoom?: ZoomOptions;
  rotation?: number;
  flipX?: boolean;
  flipY?: boolean;
  movable?: boolean;
  scalable?: boolean;
  rotatable?: boolean;
  /** Background painted behind the crop for opaque formats such as JPEG. */
  background?: string;
  output?: {
    type?: ExportFormat;
    quality?: number;
    width?: number;
    height?: number;
  };
}

export interface ExportOptions {
  type?: ExportFormat;
  quality?: number;
  width?: number;
  height?: number;
  fileName?: string;
  /** Keep the shape mask (transparent outside). Ignored for JPEG. */
  masked?: boolean;
  background?: string;
}

export interface ExportResult {
  blob: Blob;
  file: File;
  url: string;
  width: number;
  height: number;
  type: string;
}

export type CropperEvent =
  | "ready"
  | "change"
  | "crop"
  | "rotate"
  | "flip"
  | "zoom"
  | "shape-change"
  | "export"
  | "error";
