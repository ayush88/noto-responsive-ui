import { useMemo } from "react";
import { cn } from "@/lib/utils";

// Deterministic pseudo-random waveform bars for a session id or seed.
export function Waveform({
  seed = "noto",
  bars = 64,
  className,
  playing = false,
  progress = 0,
  height = 56,
}: {
  seed?: string;
  bars?: number;
  className?: string;
  playing?: boolean;
  progress?: number; // 0..1
  height?: number;
}) {
  const heights = useMemo(() => {
    // simple hash
    let h = 0;
    for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
    const rng = () => {
      h = (h * 1103515245 + 12345) & 0x7fffffff;
      return (h % 1000) / 1000;
    };
    return Array.from({ length: bars }, (_, i) => {
      const base = 0.2 + rng() * 0.8;
      const env = Math.sin((i / bars) * Math.PI); // taper edges
      return Math.max(0.08, base * env);
    });
  }, [seed, bars]);

  return (
    <div
      className={cn("flex items-center gap-[3px] w-full min-w-0", className)}
      style={{ height }}
      aria-hidden
    >
      {heights.map((h, i) => {
        const passed = i / bars < progress;
        return (
          <span
            key={i}
            className={cn(
              "flex-1 min-w-[2px] rounded-full transition-[height,background-color] duration-200",
              passed ? "bg-accent" : "bg-foreground/25",
              playing && "animate-pulse-dot",
            )}
            style={{
              height: `${h * 100}%`,
              animationDelay: `${(i % 8) * 90}ms`,
            }}
          />
        );
      })}
    </div>
  );

}
