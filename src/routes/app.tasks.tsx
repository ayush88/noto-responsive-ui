import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { sessions, allActionItems, type ActionItem } from "@/lib/mock/data";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PendingButton } from "@/components/app/pending-button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ExternalLink, X, ListChecks, Download } from "lucide-react";
import { EmptyState } from "@/components/app/empty-state";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/tasks")({
  head: () => ({ meta: [{ title: "Tasks · NoTo" }, { name: "description", content: "Action items across all your sessions." }] }),
  component: Tasks,
});

type Filter = "all" | "open" | "done" | "dismissed";

function Tasks() {
  const [filter, setFilter] = useState<Filter>("open");
  const [items, setItems] = useState<ActionItem[]>(allActionItems);

  const grouped = useMemo(() => {
    const filtered = items.filter((i) => {
      if (filter === "open") return !i.done && !i.dismissed;
      if (filter === "done") return i.done;
      if (filter === "dismissed") return i.dismissed;
      return true;
    });
    const map = new Map<string, ActionItem[]>();
    for (const item of filtered) {
      const arr = map.get(item.sessionId) ?? [];
      arr.push(item);
      map.set(item.sessionId, arr);
    }
    return Array.from(map.entries())
      .map(([sid, arr]) => ({ session: sessions.find((s) => s.id === sid)!, items: arr }))
      .filter((g) => g.session);
  }, [items, filter]);

  const openCount = items.filter((i) => !i.done && !i.dismissed).length;

  const update = (id: string, patch: Partial<ActionItem>) =>
    setItems((it) => it.map((x) => (x.id === id ? { ...x, ...patch } : x)));

  return (
    <div className="mx-auto max-w-4xl px-4 md:px-6 py-6 md:py-10">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Inbox</p>
          <h1 className="mt-2 font-serif text-4xl">Tasks</h1>
          <p className="mt-1 text-sm text-muted-foreground">{openCount} open across {new Set(items.filter((i) => !i.done && !i.dismissed).map((i) => i.sessionId)).size} sessions</p>
        </div>
        <div className="flex items-center gap-2">
          <Tabs value={filter} onValueChange={(v) => setFilter(v as Filter)}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="open">Open</TabsTrigger>
              <TabsTrigger value="done">Done</TabsTrigger>
              <TabsTrigger value="dismissed">Dismissed</TabsTrigger>
            </TabsList>
          </Tabs>
          <PendingButton variant="outline" size="sm" onAction={() => {}} toastMessage="Exported tasks as .md">
            <Download className="size-4" /> Export
          </PendingButton>
        </div>
      </div>

      <div className="mt-8 space-y-4">
        {grouped.length === 0 ? (
          <EmptyState
            icon={<ListChecks className="size-5" />}
            title={filter === "open" ? "You're all caught up." : "Nothing here."}
            description="New action items appear here automatically after each session is transcribed."
          />
        ) : grouped.map((g) => (
          <Collapsible key={g.session.id} defaultOpen>
            <div className="rounded-lg border border-hairline bg-card">
              <CollapsibleTrigger className="group flex w-full items-center gap-3 px-5 py-3 text-left">
                <ChevronDown className="size-4 text-muted-foreground group-data-[state=closed]:-rotate-90 transition-transform" aria-hidden />
                <span className="font-medium truncate">{g.session.title}</span>
                <span className="ml-auto text-xs text-muted-foreground font-mono">{g.items.length}</span>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <ul className="border-t border-hairline">
                  {g.items.map((it) => (
                    <li key={it.id} className="group flex items-start gap-3 px-5 py-3 border-b border-hairline last:border-b-0">
                      <Checkbox
                        checked={it.done}
                        onCheckedChange={(v) => { update(it.id, { done: Boolean(v) }); toast.success(v ? "Marked done" : "Reopened"); }}
                        className="mt-0.5"
                      />
                      <div className="flex-1 min-w-0">
                        <p className={cn("text-sm", it.done && "line-through text-muted-foreground", it.dismissed && "opacity-50")}>{it.text}</p>
                        <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="font-mono">Due in {it.dueDays}d</span>
                          <Link to="/app/sessions/$id" params={{ id: g.session.id }} className="hover:text-foreground inline-flex items-center gap-1">
                            <ExternalLink className="size-3" /> Source
                          </Link>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <PendingButton size="sm" variant="ghost" onAction={() => {}} toastMessage="Sent to Todoist">→ Todoist</PendingButton>
                        <PendingButton size="sm" variant="ghost" onAction={() => {}} toastMessage="Created Linear issue">→ Linear</PendingButton>
                        <Button size="sm" variant="ghost" onClick={() => { update(it.id, { dismissed: true }); toast("Dismissed", { action: { label: "Undo", onClick: () => update(it.id, { dismissed: false }) } }); }} aria-label="Dismiss">
                          <X className="size-4" />
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              </CollapsibleContent>
            </div>
          </Collapsible>
        ))}
      </div>
    </div>
  );
}
