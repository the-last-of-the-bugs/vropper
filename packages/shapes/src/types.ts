/**
 * Framework-agnostic shape contract.
 *
 * A shape only knows how to describe itself as a path inside a normalized
 * box (0,0,width,height). It never touches images, DOM, or Vue.
 */
export interface ShapeContext {
  /** Rounding factor 0..1 used by the rounded shape (1 = circle-ish). */
  radius?: number;
  /** Number of points, used by star-like shapes. */
  points?: number;
  /** Inner radius ratio for star-like shapes (0..1). */
  innerRatio?: number;
  /** Free-form extras for custom shapes. */
  [key: string]: unknown;
}

export interface ShapeDefinition {
  /** Unique shape id, e.g. "star". */
  id: string;
  /** Human readable label used by UIs. */
  label: string;
  /**
   * Build the shape path inside the box (x, y, w, h).
   * Implementations must not call beginPath()/fill() — the renderer owns that.
   */
  path: (
    ctx: CanvasRenderingContext2D | Path2D,
    x: number,
    y: number,
    w: number,
    h: number,
    options?: ShapeContext,
  ) => void;
  /** Whether the shape reacts to the `radius` option. */
  adjustableRadius?: boolean;
}

export type ShapeId =
  | "square"
  | "rounded"
  | "circle"
  | "star"
  | "heart"
  | "hexagon"
  | "triangle"
  | (string & {});
