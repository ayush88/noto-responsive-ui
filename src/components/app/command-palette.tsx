import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { sessions } from "@/lib/mock/data";
import { Mic, Upload, Settings, Sparkles, ListChecks, Library, SunMoon } from "lucide-react";
import { useTheme } from "@/lib/theme";
import { formatDistanceToNowStrict } from "date-fns";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { cycle } = useTheme();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const go = (to: string) => {
    setOpen(false);
    setTimeout(() => navigate({ to } as never), 0);
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search sessions, ask NoTo, or run a command…" />
      <CommandList>
        <CommandEmpty>Nothing here yet.</CommandEmpty>
        <CommandGroup heading="Quick actions">
          <CommandItem onSelect={() => go("/app/record")}>
            <Mic className="size-4" />
            <span>New recording</span>
          </CommandItem>
          <CommandItem onSelect={() => go("/app/import")}>
            <Upload className="size-4" />
            <span>Import audio</span>
          </CommandItem>
          <CommandItem onSelect={() => go("/app/ask")}>
            <Sparkles className="size-4" />
            <span>Ask NoTo…</span>
          </CommandItem>
          <CommandItem onSelect={() => go("/app/tasks")}>
            <ListChecks className="size-4" />
            <span>Open tasks</span>
          </CommandItem>
          <CommandItem onSelect={() => go("/app")}>
            <Library className="size-4" />
            <span>Library</span>
          </CommandItem>
          <CommandItem onSelect={() => go("/app/settings")}>
            <Settings className="size-4" />
            <span>Settings</span>
          </CommandItem>
          <CommandItem onSelect={() => { cycle(); setOpen(false); }}>
            <SunMoon className="size-4" />
            <span>Toggle theme</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Sessions">
          {sessions.slice(0, 10).map((s) => (
            <CommandItem key={s.id} onSelect={() => go(`/app/sessions/${s.id}`)} value={s.title}>
              <span className="truncate">{s.title}</span>
              <span className="ml-auto text-xs text-muted-foreground font-mono">
                {formatDistanceToNowStrict(s.createdAt)} ago
              </span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
