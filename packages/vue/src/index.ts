import type { App } from "vue";
import VropperCropper from "./components/VropperCropper.vue";
import VropperShapePicker from "./components/VropperShapePicker.vue";

export { VropperCropper, VropperShapePicker };
export { useVropper } from "./composables/useVropper";
export { useShapes } from "./composables/useShapes";
export type { VropperProps, VropperEmits } from "./types";
export * from "@vropper/core";

export default {
  install(app: App) {
    app.component("VropperCropper", VropperCropper);
    app.component("VropperShapePicker", VropperShapePicker);
  },
};
