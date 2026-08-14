interface CodeBlockProps {
  code: string;
  lang?: string;
  title?: string;
}

export function CodeBlock({ code, lang = "ts", title }: CodeBlockProps) {
  return (
    <figure className="min-w-0 max-w-full overflow-hidden rounded-2xl border border-border bg-ink">
      <figcaption className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 border-b border-ink-foreground/10 px-3 py-2.5 text-xs text-ink-foreground/60 sm:px-4">
        <span className="truncate">{title ?? "example"}</span>
        <span className="rounded-full bg-ink-foreground/10 px-2 py-0.5">{lang}</span>
      </figcaption>
      <pre className="max-w-full overflow-x-auto px-3 py-4 text-xs leading-relaxed text-ink-foreground/90 sm:px-4 sm:text-[13px]">
        <code>{code}</code>
      </pre>
    </figure>
  );
}
