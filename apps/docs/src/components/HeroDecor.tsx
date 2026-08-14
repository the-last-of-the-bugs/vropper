/** Decorative floating shapes echoing Vropper's crop masks. */
function Star({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        d="M12 1.5l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 16.7 5.9 20.1l1.4-6.8L2.2 8.6l6.9-.8z"
        fill="currentColor"
      />
    </svg>
  );
}

export function HeroDecor() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="float-slow absolute left-[8%] top-[16%] size-10 rounded-md bg-foreground/85"
        style={{ ["--spin" as string]: "-18deg" }}
      />
      <Star className="float-slow absolute left-[16%] top-[42%] size-5 text-muted-foreground/60" />
      <Star className="float-slow absolute right-[13%] top-[24%] size-5 text-muted-foreground/60" />
      <Star className="float-slow absolute left-[26%] top-[8%] size-4 text-muted-foreground/50" />
      <div className="float-slow absolute left-[13%] top-[58%] size-16 rounded-full bg-lime/90 blur-[0.2px]" />
      <div className="float-slow absolute right-[9%] top-[46%] size-14 rotate-12 rounded-full bg-[oklch(0.82_0.09_255)]" />
      <div className="absolute left-1/2 top-1/2 size-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-lime/10 blur-3xl" />
    </div>
  );
}
