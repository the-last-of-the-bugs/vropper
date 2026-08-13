import { onBeforeUnmount, onMounted, reactive, ref, shallowRef, watch, type Ref } from "vue";
import {
  Cropper,
  type AspectRatio,
  type CropperOptions,
  type CropperState,
  type ExportOptions,
  type ExportResult,
  type ImageSource,
} from "@vropper/core";
import type { ShapeContext, ShapeId } from "@vropper/shapes";

export interface UseVropperOptions extends CropperOptions {
  /** Canvas element ref the engine renders into. */
  canvas?: Ref<HTMLCanvasElement | null>;
}

/**
 * Primary composable: owns a Cropper instance and mirrors its state
 * into Vue reactivity. The engine stays framework-agnostic.
 */
export function useVropper(options: UseVropperOptions = {}) {
  const canvasRef = options.canvas ?? ref<HTMLCanvasElement | null>(null);
  const cropper = shallowRef(new Cropper(options));
  const ready = ref(false);
  const loading = ref(false);
  const error = ref<Error | null>(null);
  const state = reactive<CropperState>({ ...cropper.value.state });

  const sync = () => Object.assign(state, cropper.value.state);

  let resizeObserver: ResizeObserver | undefined;

  onMounted(() => {
    const engine = cropper.value;
    if (canvasRef.value) {
      engine.attach(canvasRef.value);
      resizeObserver = new ResizeObserver(() => engine.resize());
      resizeObserver.observe(canvasRef.value);
    }
    engine.on("change", sync);
    engine.on("ready", () => {
      ready.value = true;
      sync();
    });
    engine.on("error", (payload) => {
      error.value = payload as Error;
    });
    if (options.src) void load(options.src);
  });

  onBeforeUnmount(() => {
    resizeObserver?.disconnect();
    cropper.value.destroy();
  });

  async function load(source: ImageSource) {
    loading.value = true;
    error.value = null;
    try {
      await cropper.value.load(source);
    } catch (err) {
      error.value = err as Error;
    } finally {
      loading.value = false;
    }
  }

  watch(
    () => options.src,
    (src) => {
      if (src) void load(src);
    },
  );

  return {
    canvasRef,
    cropper,
    state,
    ready,
    loading,
    error,
    load,
    reset: () => cropper.value.reset(),
    setZoom: (zoom: number) => cropper.value.setZoom(zoom),
    zoomBy: (delta: number) => cropper.value.zoomBy(delta),
    rotate: (delta: number) => cropper.value.rotate(delta),
    setRotation: (deg: number) => cropper.value.setRotation(deg),
    flip: (axis: "x" | "y") => cropper.value.flip(axis),
    setShape: (shape: ShapeId, shapeOptions?: ShapeContext) => cropper.value.setShape(shape, shapeOptions),
    setShapeOptions: (shapeOptions: ShapeContext) => cropper.value.setShapeOptions(shapeOptions),
    setAspectRatio: (ratio: AspectRatio) => cropper.value.setAspectRatio(ratio),
    exportImage: (exportOptions?: ExportOptions): Promise<ExportResult> =>
      cropper.value.export(exportOptions),
  };
}
