import { createFileRoute } from "@tanstack/react-router";
import { CropperDemo } from "@docs/components/CropperDemo";
import { FeatureCards } from "@docs/components/FeatureCards";
import { HeroDecor } from "@docs/components/HeroDecor";
import { InstallTabs } from "@docs/components/InstallTabs";
import { CodeBlock } from "@docs/components/CodeBlock";
import { SiteNav } from "@docs/components/SiteNav";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Vropper — Shape-aware image cropper for Vue 3" },
      {
        name: "description",
        content:
          "Vropper is a shape-aware image cropping library for Vue 3: crop, rotate, flip, zoom and export with square, rounded, circle, star and heart masks.",
      },
      { property: "og:title", content: "Vropper — Shape-aware image cropper for Vue 3" },
      {
        property: "og:description",
        content:
          "Framework-agnostic crop engine with a polished Vue adapter. Install with npm, pnpm, yarn or Bun.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DocsPage,
});

const componentExample = `<script setup lang="ts">
import { ref } from "vue"
import { VropperCropper } from "@vropper/vue"

const cropper = ref()

async function save() {
  const result = await cropper.value.export({ type: "image/png", width: 512 })
  console.log(result.blob, result.file, result.url)
}
</script>

<template>
  <VropperCropper
    ref="cropper"
    src="/avatar.jpg"
    shape="rounded"
    :shape-options="{ radius: 0.6 }"
    :aspect-ratio="1"
    @ready="onReady"
    @crop="onCrop"
  />
  <button @click="save">Export</button>
</template>`;

const composableExample = `import { useVropper } from "@vropper/vue"

const {
  canvasRef, state, ready,
  load, rotate, flip, setZoom,
  setShape, setAspectRatio, exportImage,
} = useVropper({ shape: "star", aspectRatio: 1 })

rotate(90)
flip("x")
setShape("heart")
const result = await exportImage({ type: "image/webp", quality: 0.9 })`;

const coreExample = `import { Cropper } from "@vropper/core"

const cropper = new Cropper({ shape: "circle", aspectRatio: 1 })
cropper.attach(document.querySelector("canvas")!)
await cropper.load(file)

cropper.rotate(90)
cropper.flip("y")
cropper.zoomBy(0.2)
const { blob, file, url } = await cropper.export({ type: "image/png" })`;

const customShapeExample = `import { defaultShapeRegistry } from "@vropper/shapes"

defaultShapeRegistry.register({
  id: "blob",
  label: "Blob",
  path: (ctx, x, y, w, h) => {
    ctx.moveTo(x + w * 0.5, y)
    ctx.bezierCurveTo(x + w, y, x + w, y + h, x + w * 0.5, y + h)
    ctx.bezierCurveTo(x, y + h, x, y, x + w * 0.5, y)
  },
})`;

const tree = `vropper/
├─ apps/
│  ├─ docs/
│  └─ playground/
├─ packages/
│  ├─ core/     @vropper/core    engine, canvas, export
│  ├─ shapes/   @vropper/shapes  shape registry + built-ins
│  ├─ vue/      @vropper/vue     component + composables
│  └─ presets/  @vropper/presets aspect + output presets
├─ tests/
├─ pnpm-workspace.yaml
└─ turbo.json`;

const props = [
  ["src", "string | File | Blob", "Image to crop."],
  ["shape", "ShapeId", "square (default), rounded, circle, star, heart, hexagon, triangle."],
  ["shapeOptions", "{ radius, points, innerRatio }", "Rounded goes from square to circle via radius 0→1."],
  ["aspectRatio", 'number | "free"', "Crop box ratio."],
  ["zoom", "{ min, max, step }", "Zoom limits for wheel, pinch and slider."],
  ["rotation", "number", "Rotation in degrees."],
  ["movable / scalable / rotatable", "boolean", "Toggle each interaction."],
  ["output", "{ type, quality, width, height }", "Default export settings."],
];

const events = [
  ["@ready", "Image decoded — payload is the natural size."],
  ["@change", "Any state change."],
  ["@crop", "Pan or crop box change."],
  ["@rotate", "Rotation change."],
  ["@flip", "Horizontal / vertical flip."],
  ["@shape-change", "Active shape or shape options changed."],
  ["@export", "Export finished — Blob, File and object URL."],
];

function DocsPage() {
  return (
    <div id="top" className="min-h-screen w-full">
      <div className="w-full overflow-hidden bg-background">
        <SiteNav />
        
        <section className="relative px-4 sm:px-8 lg:px-12 xl:px-20 2xl:px-32 pb-16 pt-10 text-center sm:pt-20">
          <HeroDecor />
          <div className="relative">
            <h1 className="text-balance-tight mx-auto max-w-5xl text-4xl font-extrabold sm:text-6xl lg:text-7xl 2xl:text-8xl">
              Shape-aware <span className="text-lime">image cropping</span> for Vue
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-sm text-muted-foreground sm:text-base">
              Crop, rotate, flip, zoom and export — in a square, a circle, a star or a heart.
              Framework-agnostic core, first-class Vue 3 adapter.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <a
                href="#playground"
                className="glow-pill inline-flex items-center rounded-full bg-lime px-6 py-3 text-sm sm:px-7 sm:text-base font-extrabold text-lime-foreground transition-transform hover:scale-[1.03]"
              >
                Try the playground
              </a>
              <a
                href="#install"
                className="inline-flex max-w-full items-center overflow-hidden rounded-full border border-border bg-secondary px-5 py-3 text-xs font-semibold sm:px-6 sm:text-sm text-secondary-foreground transition-colors hover:bg-accent"
              >
                npm install @vropper/vue
              </a>
            </div>
          </div>
        </section>

        <FeatureCards />

        <section id="playground" className="px-4 sm:px-8 lg:px-12 xl:px-20 2xl:px-32 pb-14">
          <SectionHeading eyebrow="Playground" title="Every feature, live" />
          <CropperDemo />
        </section>

        <section id="install" className="grid min-w-0 gap-5 px-4 pb-14 sm:px-8 lg:grid-cols-2 lg:px-12 xl:px-20 2xl:px-32">
          <div className="min-w-0">
            <SectionHeading eyebrow="Install" title="Any package manager" />
            <InstallTabs />
            <p className="mt-4 text-sm text-muted-foreground">
              The Vue package re-exports the engine, so <code>@vropper/core</code> and{" "}
              <code>@vropper/shapes</code> come along for the ride. Need the engine alone? Install{" "}
              <code>@vropper/core</code> and skip Vue entirely.
            </p>
          </div>
          <div className="min-w-0">
            <CodeBlock title="main.ts" code={`import { createApp } from "vue"\nimport Vropper from "@vropper/vue"\nimport App from "./App.vue"\n\ncreateApp(App).use(Vropper).mount("#app")`} />
          </div>
        </section>

        <section id="api" className="px-4 sm:px-8 lg:px-12 xl:px-20 2xl:px-32 pb-14">
          <SectionHeading eyebrow="Usage" title="Component, composable, or raw engine" />
          <div className="grid min-w-0 gap-4 lg:grid-cols-2 2xl:gap-6">
            <div className="min-w-0">
              <CodeBlock title="Component.vue" lang="vue" code={componentExample} />
            </div>
            <div className="min-w-0 space-y-4">
              <CodeBlock title="useVropper.ts" code={composableExample} />
              <CodeBlock title="core.ts" code={coreExample} />
            </div>
          </div>

          <div className="mt-8 grid min-w-0 gap-4 lg:grid-cols-2 2xl:gap-6">
            <div className="min-w-0 rounded-3xl border border-border bg-card p-4 sm:p-6">
              <h3 className="text-xl font-bold">Props</h3>
              <dl className="mt-4 space-y-3">
                {props.map(([name, type, desc]) => (
                  <div key={name} className="border-b border-border pb-3 last:border-none">
                    <dt className="text-sm font-semibold">
                      {name} <span className="break-words font-mono text-xs text-lime">{type}</span>
                    </dt>
                    <dd className="mt-1 text-sm text-muted-foreground">{desc}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="min-w-0 rounded-3xl border border-border bg-card p-4 sm:p-6">
              <h3 className="text-xl font-bold">Events</h3>
              <dl className="mt-4 space-y-3">
                {events.map(([name, desc]) => (
                  <div key={name} className="border-b border-border pb-3 last:border-none">
                    <dt className="font-mono text-sm font-semibold text-lime">{name}</dt>
                    <dd className="mt-1 text-sm text-muted-foreground">{desc}</dd>
                  </div>
                ))}
              </dl>
              <h3 className="mt-8 text-xl font-bold">Custom shapes</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                A shape is just a path drawn into a normalized box.
              </p>
              <div className="mt-4">
                <CodeBlock title="custom-shape.ts" code={customShapeExample} />
              </div>
            </div>
          </div>
        </section>

        <section id="architecture" className="px-4 sm:px-8 lg:px-12 xl:px-20 2xl:px-32 pb-16">
          <SectionHeading eyebrow="Architecture" title="One engine, many adapters" />
          <div className="grid gap-4 lg:grid-cols-2 2xl:gap-6">
            <CodeBlock title="repository" lang="text" code={tree} />
            <div className="rounded-3xl bg-ink p-6 text-ink-foreground">
              <h3 className="text-xl font-bold">Pipeline</h3>
              <ol className="mt-4 space-y-3 text-sm text-ink-foreground/75">
                {[
                  "Image loader decodes string / File / Blob / ImageBitmap.",
                  "Cropper state holds zoom, rotation, flip, offset and shape.",
                  "Crop box is derived from the viewport and aspect ratio.",
                  "Canvas renderer clips to the shape mask and draws the transform.",
                  "Exporter re-runs the same math offscreen at output size.",
                  "Result is returned as Blob, File and object URL.",
                ].map((step, index) => (
                  <li key={step} className="flex gap-3">
                    <span className="grid size-6 shrink-0 place-items-center rounded-full bg-lime text-xs font-bold text-lime-foreground">
                      {index + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <footer className="flex flex-col items-center justify-between gap-3 border-t border-border px-4 sm:px-8 lg:px-12 xl:px-20 2xl:px-32 py-6 text-center text-xs text-muted-foreground sm:flex-row sm:text-left">
          <span>vropper · MIT licensed · a shape-aware image cropping engine for Vue</span>
          <span>@vropper/core · @vropper/shapes · @vropper/vue</span>
        </footer>
      </div>
    </div>
  );
}

function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="mb-6">
      <span className="inline-block rounded-full border border-border px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
        {eyebrow}
      </span>
      <h2 className="mt-3 text-2xl font-extrabold sm:text-3xl lg:text-4xl">{title}</h2>
    </div>
  );
}
