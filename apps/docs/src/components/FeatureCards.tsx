import { Crop, Heart, RefreshCw } from "lucide-react";

export function FeatureCards() {
  return (
    <section className="grid gap-4 px-4 sm:px-8 lg:px-12 xl:px-20 2xl:px-32 pb-8 md:grid-cols-2 lg:grid-cols-3">
      <article className="rounded-3xl bg-ink p-6 text-ink-foreground">
        <span className="inline-block rounded-full border border-ink-foreground/25 px-2.5 py-1 text-[11px] font-medium">
          Shape masks
        </span>
        <h3 className="mt-5 text-xl font-extrabold sm:text-2xl">Crop any shape</h3>
        <p className="mt-2 text-sm text-ink-foreground/70">
          Square, rounded → circle, star, heart, hexagon — or register your own.
        </p>
        <div className="mt-6 flex flex-wrap items-end gap-2">
          <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-md bg-ink-foreground/15" />
          <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-2xl bg-ink-foreground/25" />
          <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-lime" />
          <Heart className="size-14 shrink-0 fill-[oklch(0.82_0.09_255)] text-[oklch(0.82_0.09_255)]" />
        </div>
      </article>

      <article className="rounded-3xl bg-surface p-6 text-surface-foreground">
        <span className="inline-block rounded-full border border-border px-2.5 py-1 text-[11px] font-medium">
          Framework agnostic
        </span>
        <h3 className="mt-5 text-xl font-extrabold sm:text-2xl">Core has zero Vue inside</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          The engine speaks Canvas, Image, Blob and File. Vue is the first adapter — React and
          Svelte can follow without a rewrite.
        </p>
        <div className="mt-6 flex items-center gap-3 text-muted-foreground">
          <Crop className="size-8" />
          <RefreshCw className="size-8" />
          <code className="rounded-lg bg-background px-2 py-1 text-xs">@vropper/core</code>
        </div>
      </article>

      <article className="rounded-3xl bg-lime p-6 text-lime-foreground">
        <span className="inline-block rounded-full border border-lime-foreground/30 px-2.5 py-1 text-[11px] font-medium">
          Monorepo
        </span>
        <h3 className="mt-5 text-xl font-extrabold sm:text-2xl">Ships on every package manager</h3>
        <p className="mt-2 text-sm text-lime-foreground/80">
          pnpm workspaces + Turborepo. Install with npm, pnpm, yarn or Bun.
        </p>
        <div className="mt-6 grid grid-cols-2 gap-2 text-xs font-semibold">
          {["npm i", "pnpm add", "yarn add", "bun add"].map((cmd) => (
            <span key={cmd} className="rounded-xl bg-lime-foreground/10 px-3 py-2">
              {cmd} @vropper/vue
            </span>
          ))}
        </div>
      </article>
    </section>
  );
}
