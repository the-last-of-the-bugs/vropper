import { computed, ref } from "vue";
import { defaultShapeRegistry, type ShapeDefinition, type ShapeId } from "@vropper/shapes";

/** Expose the shape registry to Vue UIs (shape pickers, custom shapes). */
export function useShapes(registry = defaultShapeRegistry) {
  const version = ref(0);

  const shapes = computed<ShapeDefinition[]>(() => {
    void version.value;
    return registry.list();
  });

  function register(shape: ShapeDefinition) {
    registry.register(shape);
    version.value += 1;
  }

  function unregister(id: ShapeId) {
    registry.unregister(id);
    version.value += 1;
  }

  return { shapes, register, unregister, get: (id: ShapeId) => registry.get(id) };
}
