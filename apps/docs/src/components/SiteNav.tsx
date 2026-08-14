import { useState } from "react";
import { ArrowRight, Github, Menu, Sparkles, X } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

export function SiteNav() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-5 sm:px-8 lg:grid-cols-[minmax(0,1fr)_auto_auto] lg:px-12 xl:px-20 2xl:px-32">
      <a href="#top" className="flex min-w-0 items-center gap-2">
        <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-lime text-lime-foreground">
          <Sparkles className="size-4" />
        </span>
        <span className="font-display text-lg font-extrabold tracking-tight">vropper</span>
        <span className="hidden shrink-0 rounded-full border border-border px-2 py-0.5 text-[10px] text-muted-foreground sm:inline">
          v0.1.0
        </span>
      </a>

      <nav className="hidden items-center gap-6 text-sm text-muted-foreground lg:flex">
        <a className="transition-colors hover:text-foreground" href="#playground">
          Playground
        </a>
        <a className="transition-colors hover:text-foreground" href="#install">
          Install
        </a>
        <a className="transition-colors hover:text-foreground" href="#api">
          API
        </a>
        <a className="transition-colors hover:text-foreground" href="#architecture">
          Architecture
        </a>
      </nav>

      <div className="flex items-center gap-2">
        <ThemeToggle />
        <a
          href="#install"
          className="hidden h-9 shrink-0 items-center gap-1.5 rounded-full bg-primary px-4 text-xs font-semibold text-primary-foreground transition-transform hover:scale-[1.03] sm:inline-flex"
        >
          <Github className="size-3.5" />
          Get started
          <ArrowRight className="size-3.5" />
        </a>
        <button
          type="button"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMenuOpen((open) => !open)}
          className="grid size-9 shrink-0 place-items-center rounded-lg border border-border bg-secondary text-secondary-foreground transition-colors hover:bg-accent lg:hidden"
        >
          {menuOpen ? <X className="size-4" /> : <Menu className="size-4" />}
        </button>
      </div>

      {menuOpen && (
        <nav
          id="mobile-navigation"
          className="col-span-2 grid gap-1 border-t border-border pt-3 text-sm font-medium lg:hidden"
        >
          {[
            ["Playground", "#playground"],
            ["Install", "#install"],
            ["API", "#api"],
            ["Architecture", "#architecture"],
          ].map(([label, href]) => (
            <a
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className="rounded-lg px-3 py-2.5 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              {label}
            </a>
          ))}
          <a
            href="#install"
            onClick={() => setMenuOpen(false)}
            className="mt-1 inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-3 py-2.5 text-primary-foreground sm:hidden"
          >
            <Github className="size-4" />
            Get started
            <ArrowRight className="size-4" />
          </a>
        </nav>
      )}
    </header>
  );
}
