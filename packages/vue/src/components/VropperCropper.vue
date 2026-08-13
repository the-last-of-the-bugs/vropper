<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, shallowRef, watch } from "vue";
import { Cropper, type ExportOptions, type ExportResult } from "@vropper/core";
import type { VropperProps } from "../types";

const props = withDefaults(defineProps<VropperProps>(), {
  shape: "square",
  aspectRatio: 1,
  rotation: 0,
  movable: true,
  scalable: true,
  rotatable: true,
  flip: true,
});

const emit = defineEmits<{
  ready: [payload: { width: number; height: number }];
  change: [state: unknown];
  crop: [state: unknown];
  rotate: [state: unknown];
  flip: [state: unknown];
  "shape-change": [state: unknown];
  export: [result: ExportResult];
  error: [error: Error];
}>();

const canvasRef = ref<HTMLCanvasElement | null>(null);
const engine = shallowRef<Cropper | null>(null);
let observer: ResizeObserver | undefined;

onMounted(async () => {
  const cropper = new Cropper({
    shape: props.shape,
    shapeOptions: props.shapeOptions,
    aspectRatio: props.aspectRatio,
    zoom: props.zoom,
    rotation: props.rotation,
    movable: props.movable,
    scalable: props.scalable,
    rotatable: props.rotatable,
    background: props.background,
    output: props.output,
  });
  engine.value = cropper;

  cropper.on("ready", (p) => emit("ready", p as { width: number; height: number }));
  cropper.on("change", (s) => emit("change", s));
  cropper.on("crop", (s) => emit("crop", s));
  cropper.on("rotate", (s) => emit("rotate", s));
  cropper.on("flip", (s) => emit("flip", s));
  cropper.on("shape-change", (s) => emit("shape-change", s));
  cropper.on("export", (r) => emit("export", r as ExportResult));
  cropper.on("error", (e) => emit("error", e as Error));

  if (canvasRef.value) {
    cropper.attach(canvasRef.value);
    observer = new ResizeObserver(() => cropper.resize());
    observer.observe(canvasRef.value);
  }
  if (props.src) await cropper.load(props.src);
});

onBeforeUnmount(() => {
  observer?.disconnect();
  engine.value?.destroy();
});

watch(() => props.src, (src) => src && engine.value?.load(src));
watch(() => props.shape, (shape) => shape && engine.value?.setShape(shape));
watch(() => props.shapeOptions, (o) => o && engine.value?.setShapeOptions(o), { deep: true });
watch(() => props.aspectRatio, (r) => r !== undefined && engine.value?.setAspectRatio(r));
watch(() => props.rotation, (r) => r !== undefined && engine.value?.setRotation(r));

defineExpose({
  cropper: engine,
  rotate: (delta: number) => engine.value?.rotate(delta),
  flipHorizontal: () => engine.value?.flip("x"),
  flipVertical: () => engine.value?.flip("y"),
  zoomBy: (delta: number) => engine.value?.zoomBy(delta),
  reset: () => engine.value?.reset(),
  export: (options?: ExportOptions) => engine.value?.export(options),
});
</script>

<template>
  <div class="vropper">
    <canvas ref="canvasRef" class="vropper__canvas" />
    <slot :cropper="engine" />
  </div>
</template>

<style>
.vropper {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 240px;
}
.vropper__canvas {
  display: block;
  width: 100%;
  height: 100%;
  cursor: grab;
  touch-action: none;
}
.vropper__canvas:active {
  cursor: grabbing;
}
</style>
