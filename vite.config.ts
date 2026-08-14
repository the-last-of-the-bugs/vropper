import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import tailwindcss from "@tailwindcss/vite";
import { nitro } from "nitro/vite";
import path from "node:path";

export default defineConfig({
  plugins: [
    tanstackStart(),
    react(),
    tailwindcss(),
    nitro({
      preset: "vercel",
    }),
  ],

  resolve: {
    alias: {
      "@docs": path.resolve(import.meta.dirname, "./apps/docs/src"),
      "@vropper/core": path.resolve(import.meta.dirname, "./packages/core/src"),
      "@vropper/shapes": path.resolve(import.meta.dirname, "./packages/shapes/src"),
    },
  },
});