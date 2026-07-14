import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type Mode = "light" | "dark" | "system";
type Ctx = { mode: Mode; resolved: "light" | "dark"; setMode: (m: Mode) => void; cycle: () => void };

const ThemeCtx = createContext<Ctx | null>(null);

function resolve(mode: Mode): "light" | "dark" {
  if (mode === "system") {
    if (typeof window === "undefined") return "light";
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  return mode;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<Mode>("system");
  const [resolved, setResolved] = useState<"light" | "dark">("light");

  useEffect(() => {
    const saved = (localStorage.getItem("noto-theme") as Mode | null) ?? "system";
    setModeState(saved);
  }, []);

  useEffect(() => {
    const r = resolve(mode);
    setResolved(r);
    document.documentElement.classList.toggle("dark", r === "dark");
    localStorage.setItem("noto-theme", mode);
  }, [mode]);

  useEffect(() => {
    if (mode !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      const r = mq.matches ? "dark" : "light";
      setResolved(r);
      document.documentElement.classList.toggle("dark", r === "dark");
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [mode]);

  const setMode = (m: Mode) => setModeState(m);
  const cycle = () => setModeState((m) => (m === "light" ? "dark" : m === "dark" ? "system" : "light"));

  return <ThemeCtx.Provider value={{ mode, resolved, setMode, cycle }}>{children}</ThemeCtx.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeCtx);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
}
