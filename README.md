# Vropper

![vropper-vue](image.png)

> A shape-aware image cropper for Vue 3.

Vropper is a modern image cropping library built for Vue 3. It provides a framework-agnostic core for image manipulation together with a Vue integration.

With Vropper, you can crop, rotate, flip, and mask images using customizable shapes.

## ✨ Features

- 🖼️ Image cropping
- 🔄 Rotate images
- ↔️ Flip horizontally and vertically
- ⬜ Square crop
- ⭕ Rounded / circular crop
- ⭐ Custom crop shapes
- 💗 Love-shaped crop
- 🎨 Extensible shape system
- 🧩 Framework-agnostic core
- 💚 Vue 3 integration
- 📦 Installable through npm, pnpm, yarn, or Bun
- 🪶 TypeScript-first

## 📦 Packages

Vropper is organized as a small package ecosystem:

| Package | Description |
| --- | --- |
| `@tlob/vropper-core` | Framework-agnostic image cropping engine |
| `@tlob/vropper-shapes` | Built-in crop shapes |
| `@tlob/vropper-vue` | Vue 3 integration |

The core engine handles the image manipulation logic, while the Vue package provides the UI integration.

## 🚀 Installation

### npm

```bash
npm install @tlob/vropper-vue
```

### pnpm

```bash
pnpm add @tlob/vropper-vue
```

### yarn

```bash
yarn add @tlob/vropper-vue
```

### bun

For framework-independent usage:

```bash
bun add @tlob/vropper-vue
```

## 💡 Basic Usage
```bash
<script setup lang="ts">
import { Vropper } from "@tlob/vropper-vue";
import "@tlob/vropper-vue/style.css";
</script>

<template>
  <Vropper
    src="/example.jpg"
    :width="400"
    :height="400"
  />
</template>
```

---

<p align="center">
  Built with TypeScript and ❤️ for the open-source community.
</p>
