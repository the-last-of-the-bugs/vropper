import { describe, expect, it } from "vitest";
import { clamp, coverScale, rotatedBounds, toRadians } from "../../packages/core/src/transform/geometry";
import { computeCropBox } from "../../packages/core/src/crop/cropBox";
import { defaultShapeRegistry } from "../../packages/shapes/src/index";

describe("geometry", () => {
  it("clamps values", () => {
    expect(clamp(5, 1, 3)).toBe(3);
    expect(clamp(-2, 0, 3)).toBe(0);
  });

  it("converts degrees to radians", () => {
    expect(toRadians(180)).toBeCloseTo(Math.PI);
  });

  it("expands bounds when rotated 90deg", () => {
    const bounds = rotatedBounds(200, 100, 90);
    expect(bounds.width).toBeCloseTo(100);
    expect(bounds.height).toBeCloseTo(200);
  });

  it("covers the crop box", () => {
    expect(coverScale(200, 100, 100, 100, 0)).toBeCloseTo(1);
  });
});

describe("crop box", () => {
  it("respects a square aspect ratio", () => {
    const box = computeCropBox({ width: 400, height: 300 }, 1, 0);
    expect(box.width).toBeCloseTo(box.height);
    expect(box.height).toBeCloseTo(300);
  });

  it("fills the viewport when free", () => {
    const box = computeCropBox({ width: 400, height: 300 }, "free", 0);
    expect(box.width).toBe(400);
  });
});

describe("shape registry", () => {
  it("ships the documented built-ins", () => {
    const ids = defaultShapeRegistry.list().map((s) => s.id);
    expect(ids).toEqual(
      expect.arrayContaining(["square", "rounded", "circle", "star", "heart", "hexagon", "triangle"]),
    );
  });

  it("falls back to square for unknown shapes", () => {
    expect(defaultShapeRegistry.get("nope").id).toBe("square");
  });
});
