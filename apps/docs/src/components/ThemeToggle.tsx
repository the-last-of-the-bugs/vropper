import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

const STORAGE_KEY = "vropper-theme";

export function ThemeToggle() {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const prefersDark = stored ? stored === "dark" : true;
    setDark(prefersDark);
    document.documentElement.classList.toggle("dark", prefersDark);
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem(STORAGE_KEY, next ? "dark" : "light");
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
      className="inline-flex h-9 items-center gap-2 rounded-full border border-border bg-secondary px-3 text-xs font-medium text-secondary-foreground transition-colors hover:bg-accent"
    >
      {dark ? <Moon className="size-3.5" /> : <Sun className="size-3.5" />}
      {dark ? "Dark" : "Light"}
    </button>
  );
}
