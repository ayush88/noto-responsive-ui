import { useTheme } from "@/lib/theme";
import { Sun, Moon, Monitor } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function ThemeToggle() {
  const { mode, cycle } = useTheme();
  const Icon = mode === "light" ? Sun : mode === "dark" ? Moon : Monitor;
  const label = mode === "light" ? "Light theme" : mode === "dark" ? "Dark theme" : "System theme";
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={cycle}
          aria-label={`Theme: ${label}. Click to change.`}
          className="inline-flex size-9 items-center justify-center rounded-md border border-hairline bg-surface-1 text-foreground/80 hover:text-foreground hover:bg-surface-2 transition-colors"
        >
          <Icon className="size-4" aria-hidden />
        </button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}
