import { useState } from "react";
import { Check, Copy } from "lucide-react";

const managers = [
  { id: "npm", command: "npm install @vropper/vue" },
  { id: "pnpm", command: "pnpm add @vropper/vue" },
  { id: "yarn", command: "yarn add @vropper/vue" },
  { id: "bun", command: "bun add @vropper/vue" },
] as const;

export function InstallTabs() {
  const [active, setActive] = useState<string>("npm");
  const [copied, setCopied] = useState(false);
  const command = managers.find((m) => m.id === active)?.command ?? managers[0].command;

  const copy = async () => {
    await navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="min-w-0 rounded-2xl border border-border bg-card p-2">
      <div className="grid grid-cols-4 gap-1 px-1 pb-2">
        {managers.map((manager) => (
          <button
            key={manager.id}
            type="button"
            onClick={() => setActive(manager.id)}
            className={`min-w-0 rounded-full px-1.5 py-1.5 text-xs font-medium transition-colors sm:px-3 ${
              active === manager.id
                ? "bg-lime text-lime-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            }`}
          >
            {manager.id}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 rounded-xl bg-ink px-3 py-3 sm:gap-3 sm:px-4">
        <code className="min-w-0 overflow-x-auto whitespace-nowrap text-xs text-ink-foreground sm:text-sm">$ {command}</code>
        <button
          type="button"
          onClick={copy}
          aria-label="Copy install command"
          className="shrink-0 rounded-lg p-1.5 text-ink-foreground/70 transition-colors hover:text-lime"
        >
          {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
        </button>
      </div>
    </div>
  );
}
