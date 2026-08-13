import type { ShapeDefinition, ShapeId } from "./types";
import { square } from "./square";
import { rounded } from "./rounded";
import { circle } from "./circle";
import { star } from "./star";
import { heart } from "./heart";
import { hexagon, triangle, diamond } from "./polygon";

export type { ShapeDefinition, ShapeContext, ShapeId } from "./types";
export { square, rounded, circle, star, heart, hexagon, triangle, diamond };

/** Built-in shapes shipped with Vropper. */
export const builtinShapes: ShapeDefinition[] = [
  square,
  rounded,
  circle,
  star,
  heart,
  hexagon,
  triangle,
  diamond,
];

/** Mutable registry so consumers can plug in custom shapes. */
export class ShapeRegistry {
  private shapes = new Map<string, ShapeDefinition>();

  constructor(initial: ShapeDefinition[] = builtinShapes) {
    initial.forEach((shape) => this.register(shape));
  }

  register(shape: ShapeDefinition): this {
    this.shapes.set(shape.id, shape);
    return this;
  }

  unregister(id: ShapeId): this {
    this.shapes.delete(id);
    return this;
  }

  get(id: ShapeId): ShapeDefinition {
    return this.shapes.get(id) ?? square;
  }

  has(id: ShapeId): boolean {
    return this.shapes.has(id);
  }

  list(): ShapeDefinition[] {
    return [...this.shapes.values()];
  }
}

export const defaultShapeRegistry = new ShapeRegistry();
