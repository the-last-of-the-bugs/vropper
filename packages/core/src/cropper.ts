import { defaultShapeRegistry, type ShapeContext, type ShapeDefinition, type ShapeId } from "@vropper/shapes";
import { computeCropBox } from "./crop/cropBox";
import { renderExport, renderPreview } from "./canvas/renderer";
import { exportCanvas } from "./export/exporter";
import { loadImage } from "./image/loader";
import { Emitter } from "./state/emitter";
import { clamp } from "./transform/geometry";
import type {
  AspectRatio,
  CropperEvent,
  CropperOptions,
  CropperState,
  ExportOptions,
  ExportResult,
  ImageSource,
  Rect,
  Size,
} from "./types";

const DEFAULT_ZOOM = { min: 1, max: 5, step: 0.1 };

export interface AttachOptions {
  /** Element the pointer/wheel listeners are bound to. Defaults to the canvas. */
  interactionTarget?: HTMLElement;
  chrome?: boolean;
  backdrop?: string;
  outline?: string;
}

/**
 * The Vropper engine. Pure browser primitives, zero framework code —
 * adapters (Vue today, React/Svelte later) only wrap this class.
 */
export class Cropper {
  readonly registry = defaultShapeRegistry;

  private emitter = new Emitter();
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private image: HTMLImageElement | null = null;
  private detachFns: Array<() => void> = [];
  private viewport: Size = { width: 0, height: 0 };
  private options: CropperOptions;
  private zoomLimits = DEFAULT_ZOOM;
  private dragging = false;
  private pointers = new Map<number, { x: number; y: number }>();
  private pinchStart: { distance: number; zoom: number } | null = null;
  private last = { x: 0, y: 0 };

  state: CropperState;

  constructor(options: CropperOptions = {}) {
    this.options = options;
    this.zoomLimits = { ...DEFAULT_ZOOM, ...(options.zoom ?? {}) };
    this.state = {
      offset: { x: 0, y: 0 },
      zoom: 1,
      rotation: options.rotation ?? 0,
      flipX: options.flipX ?? false,
      flipY: options.flipY ?? false,
      shape: options.shape ?? "square",
      shapeOptions: options.shapeOptions ?? { radius: 0.25, points: 5, innerRatio: 0.45 },
      aspectRatio: options.aspectRatio ?? 1,
    };
  }

  /* ------------------------------------------------------------------ */
  /* Lifecycle                                                           */
  /* ------------------------------------------------------------------ */

  attach(canvas: HTMLCanvasElement, attachOptions: AttachOptions = {}): void {
    this.detach();
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.chromeOptions = attachOptions;

    const target = attachOptions.interactionTarget ?? canvas;
    target.style.touchAction = "none";

    const onPointerDown = (event: PointerEvent) => this.handlePointerDown(event, target);
    const onPointerMove = (event: PointerEvent) => this.handlePointerMove(event);
    const onPointerUp = (event: PointerEvent) => this.handlePointerUp(event, target);
    const onWheel = (event: WheelEvent) => this.handleWheel(event, target);

    target.addEventListener("pointerdown", onPointerDown);
    target.addEventListener("pointermove", onPointerMove);
    target.addEventListener("pointerup", onPointerUp);
    target.addEventListener("pointercancel", onPointerUp);
    target.addEventListener("wheel", onWheel, { passive: false });

    this.detachFns = [
      () => target.removeEventListener("pointerdown", onPointerDown),
      () => target.removeEventListener("pointermove", onPointerMove),
      () => target.removeEventListener("pointerup", onPointerUp),
      () => target.removeEventListener("pointercancel", onPointerUp),
      () => target.removeEventListener("wheel", onWheel),
    ];

    this.resize();
  }

  private chromeOptions: AttachOptions = {};

  detach(): void {
    this.detachFns.forEach((fn) => fn());
    this.detachFns = [];
    this.canvas = null;
    this.ctx = null;
  }

  destroy(): void {
    this.detach();
    this.emitter.clear();
    this.image = null;
  }

  on(event: CropperEvent, handler: (payload?: unknown) => void): () => void {
    return this.emitter.on(event, handler);
  }

  /* ------------------------------------------------------------------ */
  /* Image + layout                                                      */
  /* ------------------------------------------------------------------ */

  async load(source: ImageSource): Promise<void> {
    try {
      this.image = await loadImage(source);
      this.reset();
      this.emitter.emit("ready", { width: this.image.naturalWidth, height: this.image.naturalHeight });
      this.render();
    } catch (error) {
      this.emitter.emit("error", error);
      throw error;
    }
  }

  get isReady(): boolean {
    return Boolean(this.image);
  }

  resize(): void {
    if (!this.canvas) return;
    const rect = this.canvas.getBoundingClientRect();
    const dpr = typeof window === "undefined" ? 1 : window.devicePixelRatio || 1;
    this.viewport = { width: rect.width, height: rect.height };
    this.canvas.width = Math.max(1, Math.round(rect.width * dpr));
    this.canvas.height = Math.max(1, Math.round(rect.height * dpr));
    this.ctx = this.canvas.getContext("2d");
    this.ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.render();
  }

  get cropBox(): Rect {
    return computeCropBox(this.viewport, this.state.aspectRatio, 28);
  }

  /* ------------------------------------------------------------------ */
  /* Transform API                                                       */
  /* ------------------------------------------------------------------ */

  setZoom(zoom: number): void {
    if (this.options.scalable === false) return;
    this.state.zoom = clamp(zoom, this.zoomLimits.min ?? 1, this.zoomLimits.max ?? 5);
    this.commit("zoom");
  }

  zoomBy(delta: number): void {
    this.setZoom(this.state.zoom * Math.exp(delta));
  }

  setRotation(degrees: number): void {
    if (this.options.rotatable === false) return;
    this.state.rotation = ((degrees % 360) + 360) % 360;
    this.commit("rotate");
  }

  rotate(delta: number): void {
    this.setRotation(this.state.rotation + delta);
  }

  flip(axis: "x" | "y"): void {
    if (axis === "x") this.state.flipX = !this.state.flipX;
    else this.state.flipY = !this.state.flipY;
    this.commit("flip");
  }

  pan(dx: number, dy: number): void {
    if (this.options.movable === false) return;
    this.state.offset = { x: this.state.offset.x + dx, y: this.state.offset.y + dy };
    this.commit("crop");
  }

  setShape(shape: ShapeId, shapeOptions?: ShapeContext): void {
    this.state.shape = shape;
    if (shapeOptions) this.state.shapeOptions = { ...this.state.shapeOptions, ...shapeOptions };
    this.commit("shape-change");
  }

  setShapeOptions(shapeOptions: ShapeContext): void {
    this.state.shapeOptions = { ...this.state.shapeOptions, ...shapeOptions };
    this.commit("shape-change");
  }

  setAspectRatio(aspectRatio: AspectRatio): void {
    this.state.aspectRatio = aspectRatio;
    this.commit("change");
  }

  registerShape(shape: ShapeDefinition): void {
    this.registry.register(shape);
  }

  listShapes(): ShapeDefinition[] {
    return this.registry.list();
  }

  reset(): void {
    this.state.offset = { x: 0, y: 0 };
    this.state.zoom = 1;
    this.state.rotation = this.options.rotation ?? 0;
    this.state.flipX = this.options.flipX ?? false;
    this.state.flipY = this.options.flipY ?? false;
    this.commit("change");
  }

  /* ------------------------------------------------------------------ */
  /* Render + export                                                     */
  /* ------------------------------------------------------------------ */

  render(): void {
    if (!this.ctx || !this.image || this.viewport.width === 0) return;
    renderPreview(this.ctx, {
      image: this.image,
      state: this.state,
      cropBox: this.cropBox,
      viewport: this.viewport,
      chrome: this.chromeOptions.chrome,
      backdrop: this.chromeOptions.backdrop,
      outline: this.chromeOptions.outline,
      background: this.options.background,
    });
  }

  async export(exportOptions: ExportOptions = {}): Promise<ExportResult> {
    if (!this.image) throw new Error("Vropper: no image loaded");
    const box = this.cropBox;
    const type = exportOptions.type ?? this.options.output?.type ?? "image/png";
    const opaque = type === "image/jpeg";
    const width = exportOptions.width ?? this.options.output?.width ?? Math.round(box.width * 2);
    const height =
      exportOptions.height ?? this.options.output?.height ?? Math.round((width / box.width) * box.height);

    const canvas = renderExport({
      image: this.image,
      state: this.state,
      cropBox: box,
      width,
      height,
      masked: exportOptions.masked ?? true,
      background: exportOptions.background ?? (opaque ? "#ffffff" : undefined),
    });

    const result = await exportCanvas(canvas, {
      ...exportOptions,
      type,
      quality: exportOptions.quality ?? this.options.output?.quality ?? 0.92,
    });
    this.emitter.emit("export", result);
    return result;
  }

  /* ------------------------------------------------------------------ */
  /* Interaction                                                         */
  /* ------------------------------------------------------------------ */

  private commit(event: CropperEvent): void {
    this.render();
    this.emitter.emit(event, this.state);
    if (event !== "change") this.emitter.emit("change", this.state);
  }

  private handlePointerDown(event: PointerEvent, target: HTMLElement): void {
    target.setPointerCapture?.(event.pointerId);
    this.pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (this.pointers.size === 2) {
      this.pinchStart = { distance: this.pointerDistance(), zoom: this.state.zoom };
      return;
    }
    this.dragging = true;
    this.last = { x: event.clientX, y: event.clientY };
  }

  private handlePointerMove(event: PointerEvent): void {
    if (!this.pointers.has(event.pointerId)) return;
    this.pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });

    if (this.pointers.size === 2 && this.pinchStart) {
      const distance = this.pointerDistance();
      if (this.pinchStart.distance > 0) {
        this.setZoom((this.pinchStart.zoom * distance) / this.pinchStart.distance);
      }
      return;
    }

    if (!this.dragging) return;
    this.pan(event.clientX - this.last.x, event.clientY - this.last.y);
    this.last = { x: event.clientX, y: event.clientY };
  }

  private handlePointerUp(event: PointerEvent, target: HTMLElement): void {
    target.releasePointerCapture?.(event.pointerId);
    this.pointers.delete(event.pointerId);
    if (this.pointers.size < 2) this.pinchStart = null;
    if (this.pointers.size === 0) this.dragging = false;
  }

  private handleWheel(event: WheelEvent, _target: HTMLElement): void {
    event.preventDefault();
    const dy = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? 100 : 1);
    this.zoomBy(-dy * 0.0015);
  }

  private pointerDistance(): number {
    const [a, b] = [...this.pointers.values()];
    if (!a || !b) return 0;
    return Math.hypot(a.x - b.x, a.y - b.y);
  }
}

export function createCropper(options?: CropperOptions): Cropper {
  return new Cropper(options);
}
