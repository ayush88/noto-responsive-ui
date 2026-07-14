import { Link } from "@tanstack/react-router";
import { formatDistanceToNowStrict } from "date-fns";
import { Clock, CheckCircle2, Loader2, AlertTriangle } from "lucide-react";
import type { Session } from "@/lib/mock/data";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

function formatDuration(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return m >= 60 ? `${Math.floor(m / 60)}h ${m % 60}m` : `${m}m ${s.toString().padStart(2, "0")}s`;
}

export function SessionCard({
  session,
  selected,
  onSelectChange,
  showSelect,
}: {
  session: Session;
  selected?: boolean;
  onSelectChange?: (v: boolean) => void;
  showSelect?: boolean;
}) {
  const status = session.status;
  return (
    <div className="group relative rounded-lg border border-hairline bg-card hover:border-foreground/25 transition-colors">
      {showSelect && (
        <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 data-[on=true]:opacity-100 transition-opacity" data-on={selected}>
          <Checkbox
            checked={selected}
            onCheckedChange={(v) => onSelectChange?.(Boolean(v))}
            aria-label={`Select ${session.title}`}
          />
        </div>
      )}
      <Link to="/app/sessions/$id" params={{ id: session.id }} className="block p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-serif text-lg leading-snug line-clamp-2">{session.title}</h3>
          <StatusChip status={status} />
        </div>
        <p className="mt-2 text-sm text-muted-foreground line-clamp-2 min-h-10">
          {session.tldr || "No summary yet."}
        </p>
        <div className="mt-4 flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-3 font-mono tabular text-muted-foreground">
            <span>{formatDistanceToNowStrict(session.createdAt)} ago</span>
            <span className="inline-flex items-center gap-1"><Clock className="size-3" aria-hidden />{formatDuration(session.durationSec)}</span>
          </div>
          <div className="flex flex-wrap items-center justify-end gap-1">
            {session.tags.slice(0, 2).map((t) => (
              <span key={t} className="rounded-full border border-hairline px-2 py-0.5 text-[11px] text-muted-foreground">
                {t}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </div>
  );
}

export function StatusChip({ status }: { status: Session["status"] }) {
  const cfg = {
    transcribed: { icon: CheckCircle2, label: "Transcribed", cls: "text-success" },
    processing: { icon: Loader2, label: "Processing", cls: "text-warning" },
    failed: { icon: AlertTriangle, label: "Failed", cls: "text-destructive" },
  }[status];
  const Icon = cfg.icon;
  return (
    <span className={cn("inline-flex items-center gap-1 text-[11px] font-medium shrink-0", cfg.cls)}>
      <Icon className={cn("size-3", status === "processing" && "animate-spin")} aria-hidden />
      {cfg.label}
    </span>
  );
}

export function formatDur(sec: number) {
  return formatDuration(sec);
}
