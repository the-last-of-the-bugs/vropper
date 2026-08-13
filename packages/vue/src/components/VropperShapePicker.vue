<script setup lang="ts">
import { useShapes } from "../composables/useShapes";
import type { ShapeId } from "@vropper/shapes";

defineProps<{ modelValue: ShapeId }>();
const emit = defineEmits<{ "update:modelValue": [shape: ShapeId] }>();

const { shapes } = useShapes();
</script>

<template>
  <div class="vropper-shape-picker">
    <button
      v-for="shape in shapes"
      :key="shape.id"
      type="button"
      class="vropper-shape-picker__item"
      :class="{ 'is-active': shape.id === modelValue }"
      @click="emit('update:modelValue', shape.id)"
    >
      {{ shape.label }}
    </button>
  </div>
</template>

<style>
.vropper-shape-picker {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.vropper-shape-picker__item {
  border: 1px solid currentColor;
  border-radius: 999px;
  padding: 6px 14px;
  font-size: 13px;
  background: transparent;
  cursor: pointer;
}
.vropper-shape-picker__item.is-active {
  background: currentColor;
}
</style>
