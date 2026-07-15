import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState, useCallback } from "react";
import { sessions as allSessions, calendarEvents, insights, allTags } from "@/lib/mock/data";
import { SessionCard } from "@/components/app/session-card";
import { EmptyState } from "@/components/app/empty-state";
import { PendingButton } from "@/components/app/pending-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Mic, Upload, Trash2, Tag, Download, Sparkles, Calendar, X, Inbox } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/")({
  head: () => ({
    meta: [
      { title: "Library · NoTo" },
      { name: "description", content: "All your captured sessions in one place." },
    ],
  }),
  component: Library,
});

type Mode = "keyword" | "semantic" | "hybrid";

function Library() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [mode, setMode] = useState<Mode>("hybrid");
  const [tags, setTags] = useState<string[]>([]);
  const [tab, setTab] = useState<"active" | "bin">("active");
  const [selected, setSelected] = useState<string[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [insightSummary, setInsightSummary] = useState(insights.summary);

  const filtered = useMemo(() => {
    const base = allSessions.filter((s) => (tab === "bin" ? s.binned : !s.binned));
    return base.filter((s) => {
      if (tags.length && !tags.some((t) => s.tags.includes(t))) return false;
      if (!q.trim()) return true;
      const hay = `${s.title} ${s.tldr} ${s.tags.join(" ")}`.toLowerCase();
      return hay.includes(q.toLowerCase());
    });
  }, [q, tags, tab]);

  const toggleSelect = (id: string) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const clearSelection = () => setSelected([]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length > 0) {
      toast.success(`Importing ${e.dataTransfer.files[0].name}`);
      navigate({ to: "/app/import" });
    }
  }, [navigate]);

  return (
    <div
      className="mx-auto max-w-7xl px-4 md:px-6 py-8"
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={onDrop}
    >
      {dragOver && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-background/85 backdrop-blur pointer-events-none">
          <div className="rounded-xl border-2 border-dashed border-accent px-10 py-16 text-center">
            <Upload className="size-8 mx-auto text-accent" aria-hidden />
            <p className="mt-4 font-serif text-2xl">Drop to import audio</p>
            <p className="mt-1 text-sm text-muted-foreground">.mp3, .wav, .m4a, .webm up to 500MB</p>
          </div>
        </div>
      )}

      {/* Greeting */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Good morning</p>
          <h1 className="mt-2 font-serif text-4xl md:text-5xl">Alex.</h1>
        </div>
        <div className="flex items-center gap-2">
          <PendingButton
            variant="outline"
            onAction={() => navigate({ to: "/app/import" })}
            toastMessage="Import ready"
          >
            <Upload className="size-4" /> Import
          </PendingButton>
          <PendingButton
            onAction={() => navigate({ to: "/app/record" })}
            toastMessage="Recorder ready"
          >
            <Mic className="size-4" /> New recording
          </PendingButton>
        </div>
      </div>

      {/* Upcoming events */}
      <section className="mt-8">
        <div className="mb-3 flex items-center gap-2">
          <Calendar className="size-4 text-muted-foreground" aria-hidden />
          <h2 className="text-sm font-medium text-muted-foreground">Upcoming events</h2>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0">
          {calendarEvents.map((e) => (
            <button
              key={e.id}
              onClick={() => { toast.success(`Recorder queued for "${e.title}"`); navigate({ to: "/app/record" }); }}
              className="shrink-0 w-64 text-left rounded-lg border border-hairline bg-card hover:border-foreground/25 transition-colors p-4"
            >
              <p className="font-mono text-[11px] text-muted-foreground">{e.time}</p>
              <p className="mt-2 font-medium text-sm truncate">{e.title}</p>
              <p className="mt-1 text-xs text-muted-foreground">{e.duration} min</p>
            </button>
          ))}
        </div>
      </section>

      {/* Insights this week */}
      <section className="mt-8 rounded-lg border border-hairline bg-card p-5 md:p-6">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="inline-flex size-9 shrink-0 items-center justify-center rounded-md bg-accent/10 text-accent">
              <Sparkles className="size-4" aria-hidden />
            </div>
            <h2 className="truncate text-lg md:text-xl font-semibold">Insights this week</h2>
          </div>
          <PendingButton
            variant="ghost"
            size="sm"
            pendingLabel="Regenerating…"
            onAction={async () => {
              setRegenerating(true);
              await new Promise((r) => setTimeout(r, 900));
              setInsightSummary(insights.summary + " Your median session length dropped from 34 to 28 minutes.");
              setRegenerating(false);
            }}
            toastMessage="Insights refreshed"
          >
            Regenerate
          </PendingButton>
        </div>
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Stat label="Hours captured" value={`${insights.hoursCaptured}h`} />
          <Stat label="Sessions" value={String(insights.sessionsCount)} />
          <Stat label="Top tags" value={insights.topTags.slice(0, 2).join(", ")} />
        </div>
        <p className={cn("mt-5 text-sm text-muted-foreground leading-relaxed", regenerating && "opacity-50")}>
          {insightSummary}
        </p>
      </section>


      {/* Search + filters */}
      <section className="mt-10">
        <div className="flex flex-col gap-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" aria-hidden />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search sessions, transcripts, tags…"
              className="pl-9 h-11"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <SegmentedMode value={mode} onChange={setMode} />
            <Tabs value={tab} onValueChange={(v) => setTab(v as "active" | "bin")}>
              <TabsList>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="bin">Recycle bin</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {allTags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {allTags.map((t) => {
              const on = tags.includes(t);
              return (
                <button
                  key={t}
                  onClick={() => setTags((tt) => (on ? tt.filter((x) => x !== t) : [...tt, t]))}
                  className={cn(
                    "rounded-full border px-2.5 py-1 text-xs transition-colors",
                    on ? "bg-foreground text-background border-foreground" : "border-hairline text-muted-foreground hover:text-foreground",
                  )}
                >
                  {t}
                </button>
              );
            })}
            {(tags.length > 0 || q) && (
              <button
                onClick={() => { setTags([]); setQ(""); }}
                className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs text-muted-foreground hover:text-foreground"
              >
                <X className="size-3" aria-hidden /> Clear
              </button>
            )}
          </div>
        )}
      </section>

      {/* Session grid */}
      <section className="mt-6">
        {filtered.length === 0 ? (
          <EmptyState
            icon={<Inbox className="size-5" aria-hidden />}
            title={tab === "bin" ? "Recycle bin is empty." : "No sessions match."}
            description={tab === "bin" ? "Deleted sessions land here for 30 days before permanent removal." : "Try loosening your filters, or record something new."}
            action={
              tab === "active" && (
                <PendingButton onAction={() => navigate({ to: "/app/record" })}>
                  <Mic className="size-4" /> New recording
                </PendingButton>
              )
            }
            secondary={tab === "active" && (
              <Button variant="ghost" onClick={() => navigate({ to: "/app/import" })}>
                <Upload className="size-4" /> Import audio
              </Button>
            )}
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((s) => (
              <SessionCard
                key={s.id}
                session={s}
                selected={selected.includes(s.id)}
                onSelectChange={() => toggleSelect(s.id)}
                showSelect
              />
            ))}
          </div>
        )}
      </section>

      {/* Bulk action bar */}
      {selected.length > 0 && (
        <div className="fixed left-1/2 -translate-x-1/2 bottom-24 md:bottom-6 z-40 flex items-center gap-2 rounded-full border border-hairline bg-card px-3 py-2 shadow-lg">
          <span className="text-sm font-medium pl-2">{selected.length} selected</span>
          <div className="mx-2 h-5 w-px bg-hairline" />
          <PendingButton variant="ghost" size="sm" onAction={() => {}} toastMessage={`Tagged ${selected.length} sessions`}>
            <Tag className="size-4" /> Tag
          </PendingButton>
          <PendingButton variant="ghost" size="sm" onAction={() => {}} toastMessage={`Exported ${selected.length} sessions as .md`}>
            <Download className="size-4" /> Export
          </PendingButton>
          <PendingButton
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive"
            pendingLabel="Deleting…"
            onAction={() => { clearSelection(); }}
            toastMessage={`Moved ${selected.length} to Recycle bin`}
          >
            <Trash2 className="size-4" /> Delete
          </PendingButton>
          <button onClick={clearSelection} aria-label="Clear selection" className="ml-1 p-1.5 text-muted-foreground hover:text-foreground">
            <X className="size-4" />
          </button>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-hairline bg-surface-1 p-3 min-w-0">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-semibold tracking-tight tabular truncate">{value}</p>
    </div>
  );
}


function SegmentedMode({ value, onChange }: { value: Mode; onChange: (m: Mode) => void }) {
  const opts: Mode[] = ["keyword", "semantic", "hybrid"];
  return (
    <div className="inline-flex rounded-md border border-hairline bg-surface-1 p-0.5">
      {opts.map((o) => (
        <button
          key={o}
          onClick={() => onChange(o)}
          className={cn(
            "px-3 h-8 text-xs capitalize rounded",
            value === o ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
          )}
        >
          {o}
        </button>
      ))}
    </div>
  );
}
