import { Link, useLocation } from "@tanstack/react-router";
import { type ReactNode } from "react";
import { Wordmark, Logo } from "@/components/brand/logo";
import { ThemeToggle } from "@/components/app/theme-toggle";
import { CommandPalette } from "@/components/app/command-palette";
import { Library, Sparkles, ListChecks, Mic, Search, User } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

const nav = [
  { to: "/app", label: "Library", icon: Library, exact: true },
  { to: "/app/ask", label: "Ask", icon: Sparkles },
  { to: "/app/tasks", label: "Tasks", icon: ListChecks },
  { to: "/app/record", label: "Record", icon: Mic },
];

const mobileTabs = [
  { to: "/app", label: "Library", icon: Library, exact: true },
  { to: "/app/ask", label: "Ask", icon: Sparkles },
  { to: "/app/record", label: "Record", icon: Mic },
];

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh flex flex-col bg-background text-foreground">
      <AppHeader />
      <main className="flex-1 pb-24 md:pb-8">{children}</main>
      <MobileTabBar />
      <CommandPalette />
    </div>
  );
}

function AppHeader() {
  const { pathname } = useLocation();
  return (
    <header className="sticky top-0 z-40 border-b border-hairline bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-3 px-4 md:px-6">
        <Link to="/app" className="flex items-center gap-2 shrink-0">
          <Logo size={22} />
          <Wordmark className="hidden sm:inline" />
        </Link>
        <nav className="ml-4 hidden md:flex items-center gap-1">
          {nav.map((n) => {
            const active = n.exact ? pathname === n.to : pathname.startsWith(n.to);
            return (
              <Link
                key={n.to}
                to={n.to}
                className={cn(
                  "px-3 py-1.5 text-sm rounded-md transition-colors",
                  active ? "text-foreground bg-surface-2" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={() => {
              // dispatch cmd+k
              const ev = new KeyboardEvent("keydown", { key: "k", metaKey: true });
              window.dispatchEvent(ev);
            }}
            aria-label="Open command palette"
            className="hidden sm:inline-flex items-center gap-2 h-9 px-3 rounded-md border border-hairline bg-surface-1 text-muted-foreground hover:text-foreground text-sm min-w-[220px]"
          >
            <Search className="size-4" aria-hidden />
            <span>Search or ask…</span>
            <kbd className="ml-auto font-mono text-[11px] rounded border border-hairline px-1.5 py-0.5">⌘K</kbd>
          </button>
          <ThemeToggle />
          <AvatarMenu />
        </div>
      </div>
    </header>
  );
}

function AvatarMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          aria-label="Account menu"
          className="inline-flex size-9 items-center justify-center rounded-full bg-foreground text-background text-sm font-medium"
        >
          AK
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex flex-col">
          <span className="text-sm">Alex Kim</span>
          <span className="text-xs text-muted-foreground font-normal">alex@company.com</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild><Link to="/app/settings">Profile</Link></DropdownMenuItem>
        <DropdownMenuItem asChild><Link to="/app/settings">Settings</Link></DropdownMenuItem>
        <DropdownMenuSeparator />
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Sign out</DropdownMenuItem>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Sign out of NoTo?</AlertDialogTitle>
              <AlertDialogDescription>You'll need to sign in again to access your library.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => toast.success("Signed out")}>Sign out</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function MobileTabBar() {
  const { pathname } = useLocation();
  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t border-hairline bg-background/95 backdrop-blur pb-[env(safe-area-inset-bottom)]"
      aria-label="Primary"
    >
      <ul className="grid grid-cols-3">
        {mobileTabs.map((t) => {
          const active = t.exact ? pathname === t.to : pathname.startsWith(t.to);
          const Icon = t.icon;
          return (
            <li key={t.to}>
              <Link
                to={t.to}
                className={cn(
                  "flex flex-col items-center gap-1 py-2.5 min-h-14 text-xs",
                  active ? "text-foreground" : "text-muted-foreground",
                )}
              >
                <Icon className={cn("size-5", active && "text-accent")} aria-hidden />
                <span>{t.label}</span>
                {active && <span className="h-[2px] w-6 bg-accent rounded-full" />}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
