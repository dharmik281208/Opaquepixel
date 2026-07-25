import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

function getInitialTheme() {
  if (typeof window === "undefined") return "light";
  const saved = window.localStorage.getItem("theme");
  if (saved === "light" || saved === "dark") return saved;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const initial = getInitialTheme();
    setTheme(initial);
    document.documentElement.classList.toggle("dark", initial === "dark");
    setMounted(true);
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.classList.toggle("dark", next === "dark");
    try {
      window.localStorage.setItem("theme", next);
    } catch {
      /* ignore */
    }
  };

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      aria-pressed={isDark}
      className="relative inline-flex h-9 w-16 items-center rounded-full border border-[color:var(--border)] bg-[color:var(--muted)] px-1 transition-colors hover:border-[color:var(--orchid)] cursor-pointer"
    >
      <span
        className={`inline-flex h-7 w-7 items-center justify-center rounded-full bg-[color:var(--card)] shadow-[var(--shadow-soft)] transition-transform duration-300 ${
          mounted && isDark ? "translate-x-7" : "translate-x-0"
        }`}
      >
        {isDark ? (
          <Moon className="h-4 w-4 text-[color:var(--lilac)]" />
        ) : (
          <Sun className="h-4 w-4 text-[color:var(--orchid)]" />
        )}
      </span>
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}
