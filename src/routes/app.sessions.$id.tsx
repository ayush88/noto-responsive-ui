import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import { findSession, type Session } from "@/lib/mock/data";
import { StatusChip, formatDur } from "@/components/app/session-card";
import { Waveform } from "@/components/app/waveform";
import { PendingButton } from "@/components/app/pending-button";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  Play, Pause, SkipForward, SkipBack, Copy, Download, Trash2, MoreHorizontal, Link2, Mail, Send, ShieldCheck, User, Search, Check, RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/sessions/$id")({
  loader: ({ params }) => {
    const session = findSession(params.id);
    if (!session) throw notFound();
    return { session };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.session.title} · NoTo` },
          { name: "description", content: loaderData.session.tldr || "Session detail" },
        ]
      : [{ title: "Session · NoTo" }, { name: "robots", content: "noindex" }],
  }),
  notFoundComponent: () => (
    <div className="mx-auto max-w-md py-24 px-6 text-center">
      <h1 className="font-serif text-4xl">Session not found.</h1>
      <p className="mt-3 text-muted-foreground text-sm">It may have been deleted or the link is wrong.</p>
      <Link to="/app" className="mt-6 inline-block rounded-md bg-foreground px-4 py-2 text-sm text-background">Back to Library</Link>
    </div>
  ),
  component: SessionDetail,
});

type Density = "comfortable" | "compact";

function SessionDetail() {
  const { session } = Route.useLoaderData() as { session: Session };
  const [title, setTitle] = useState(session.title);
  const [savedFlash, setSavedFlash] = useState(false);
  const [tldr, setTldr] = useState(session.tldr);
  const [keyPoints, setKeyPoints] = useState(session.keyPoints);
  const [actions, setActions] = useState(session.actionItems);
  const [regenerating, setRegenerating] = useState(false);
  const [density, setDensity] = useState<Density>("comfortable");
  const [speed, setSpeed] = useState("1");

  const [find, setFind] = useState("");
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0.18);
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; text: string; citations?: number[] }[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [e2ee, setE2ee] = useState(false);
  const [expiry, setExpiry] = useState("7d");
  const audioRef = useRef<HTMLDivElement>(null);

  const flashSaved = () => { setSavedFlash(true); setTimeout(() => setSavedFlash(false), 1400); };

  const filteredSegments = useMemo(() => {
    if (!find.trim()) return session.segments;
    return session.segments.filter((s) => s.text.toLowerCase().includes(find.toLowerCase()));
  }, [find, session.segments]);

  const toggleAction = (id: string) => {
    setActions((a) => a.map((x) => (x.id === id ? { ...x, done: !x.done } : x)));
    toast.success("Action item updated");
  };

  const sendChat = () => {
    if (!chatInput.trim()) return;
    const q = chatInput;
    setMessages((m) => [...m, { role: "user", text: q }]);
    setChatInput("");
    setTimeout(() => {
      setMessages((m) => [...m, {
        role: "assistant",
        text: `Based on the transcript, the team agreed to ship the redesigned welcome flow before the marketing push, targeting the 15th to give QA a full week.`,
        citations: [session.segments[3]?.start ?? 0, session.segments[5]?.start ?? 0],
      }]);
    }, 700);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 md:px-6 py-6 md:py-8">
      {/* Sticky sub-header */}
      <div className="sticky top-14 z-30 -mx-4 md:-mx-6 border-b border-hairline bg-background/85 backdrop-blur">
        <div className="flex flex-col md:flex-row md:items-center gap-3 px-4 md:px-6 py-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={() => { if (title !== session.title) { flashSaved(); toast.success("Title updated"); } }}
                className="border-0 shadow-none px-0 h-auto text-xl md:text-2xl font-serif tracking-tight bg-transparent focus-visible:ring-0"
              />
              {savedFlash && (
                <span className="inline-flex items-center gap-1 rounded-full bg-success/10 text-success text-xs px-2 py-0.5 animate-rise-in">
                  <Check className="size-3" /> Saved
                </span>
              )}
            </div>
            <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground font-mono tabular">
              <span>{format(session.createdAt, "MMM d, yyyy · HH:mm")}</span>
              <span>·</span>
              <span>{formatDur(session.durationSec)}</span>
              <span>·</span>
              <span>{session.segments.length} segments</span>
              <span>·</span>
              <StatusChip status={session.status} />
            </div>
          </div>
          <TagPicker session={session} />
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6 min-w-0">
          {/* Summary */}
          <section className="rounded-lg border border-hairline bg-card">
            <div className="flex items-center justify-between border-b border-hairline px-5 py-3">
              <h2 className="font-serif text-lg">Summary</h2>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="p-1.5 text-muted-foreground hover:text-foreground" aria-label="Summary actions">
                    <MoreHorizontal className="size-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onSelect={async () => {
                    setRegenerating(true);
                    await new Promise((r) => setTimeout(r, 900));
                    setTldr(tldr + " Regenerated with the latest template.");
                    setRegenerating(false);
                    toast.success("Summary regenerated");
                  }}><RotateCcw className="size-4" /> Regenerate</DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => toast("Restored previous version")}>Restore previous</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Change template</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className={cn("p-5 space-y-5", regenerating && "opacity-60")}>
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground font-mono">TL;DR</p>
                <Textarea
                  value={tldr}
                  onChange={(e) => setTldr(e.target.value)}
                  onBlur={() => { flashSaved(); toast.success("Summary saved"); }}
                  className="mt-2 min-h-[64px] resize-none border-0 shadow-none px-0 bg-transparent focus-visible:ring-0 text-[15px] leading-relaxed"
                />
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground font-mono">Key points</p>
                <ul className="mt-3 space-y-2">
                  {keyPoints.map((kp, i) => (
                    <li key={i} className="flex gap-3 text-sm">
                      <span className="mt-2 size-1 shrink-0 rounded-full bg-accent" />
                      <Input
                        value={kp}
                        onChange={(e) => setKeyPoints((k) => k.map((x, j) => (j === i ? e.target.value : x)))}
                        onBlur={() => flashSaved()}
                        className="border-0 shadow-none px-0 h-auto bg-transparent focus-visible:ring-0"
                      />
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground font-mono">Action items</p>
                <ul className="mt-3 space-y-2">
                  {actions.map((a) => (
                    <li key={a.id} className="flex items-start gap-3">
                      <Checkbox checked={a.done} onCheckedChange={() => toggleAction(a.id)} className="mt-0.5" />
                      <span className={cn("text-sm flex-1", a.done && "line-through text-muted-foreground")}>{a.text}</span>
                      <span className="text-xs text-muted-foreground font-mono">Due in {a.dueDays}d</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Ask this session */}
          <section className="rounded-lg border border-hairline bg-card">
            <div className="border-b border-hairline px-5 py-3">
              <h2 className="font-serif text-lg">Ask this session</h2>
            </div>
            <div className="p-5">
              {messages.length === 0 ? (
                <div className="text-sm text-muted-foreground">
                  <p>Ask anything about this recording. Try:</p>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    {["What did we commit to?", "Summarize in 3 bullets", "Who owns each action item?", "What was left unresolved?"].map((q) => (
                      <button key={q} onClick={() => setChatInput(q)} className="rounded-md border border-hairline bg-surface-1 px-3 py-2 text-left text-sm hover:bg-surface-2">
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((m, i) => (
                    <div key={i} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
                      <div className={cn(
                        "max-w-[85%] rounded-lg px-4 py-2.5 text-sm",
                        m.role === "user" ? "bg-foreground text-background" : "bg-surface-2",
                      )}>
                        <p className="leading-relaxed">{m.text}</p>
                        {m.citations && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {m.citations.map((t, ci) => (
                              <button key={ci} onClick={() => audioRef.current?.scrollIntoView({ behavior: "smooth" })}
                                className="inline-flex items-center gap-1 rounded-full bg-background/60 border border-hairline px-2 py-0.5 text-[11px] font-mono tabular hover:border-accent">
                                {formatTC(t)}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div className="mt-4 flex gap-2">
                <Input placeholder="Ask about this session…" value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && sendChat()} />
                <Button onClick={sendChat} disabled={!chatInput.trim()}><Send className="size-4" /></Button>
              </div>
            </div>
          </section>

          {/* Audio + transcript */}
          <section className="rounded-lg border border-hairline bg-card" ref={audioRef}>
            <div className="border-b border-hairline px-5 py-4">
              <div className="flex items-center gap-4">
                <button onClick={() => setPlaying((p) => !p)} className="grid size-11 place-items-center rounded-full bg-foreground text-background hover:opacity-90" aria-label={playing ? "Pause" : "Play"}>
                  {playing ? <Pause className="size-5" /> : <Play className="size-5" />}
                </button>
                <button aria-label="Skip back 15s" className="p-2 text-muted-foreground hover:text-foreground"><SkipBack className="size-4" /></button>
                <button aria-label="Skip forward 15s" className="p-2 text-muted-foreground hover:text-foreground"><SkipForward className="size-4" /></button>
                <div className="flex-1">
                  <Waveform seed={session.id} bars={80} progress={progress} height={40} />
                </div>
                <span className="font-mono tabular text-xs text-muted-foreground">
                  {formatTC(Math.round(session.durationSec * progress))} / {formatTC(session.durationSec)}
                </span>
                <Select defaultValue="1">
                  <SelectTrigger className="w-[72px] h-8"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["0.75","1","1.25","1.5","2"].map((v) => <SelectItem key={v} value={v}>{v}x</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <input
                type="range" min={0} max={1000} value={progress * 1000}
                onChange={(e) => setProgress(Number(e.target.value) / 1000)}
                className="mt-3 w-full accent-[color:var(--color-accent)]"
                aria-label="Seek"
              />
            </div>

            <div className="flex items-center justify-between gap-3 border-b border-hairline px-5 py-3">
              <Tabs value={view} onValueChange={(v) => setView(v as ViewMode)}>
                <TabsList>
                  <TabsTrigger value="speaker">Speaker</TabsTrigger>
                  <TabsTrigger value="polished">Polished</TabsTrigger>
                  <TabsTrigger value="timestamp">Timestamped</TabsTrigger>
                </TabsList>
              </Tabs>
              <div className="relative">
                <Search className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                <Input value={find} onChange={(e) => setFind(e.target.value)} placeholder="Find in transcript" className="pl-8 h-8 w-56" />
                {find && (
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[11px] font-mono text-muted-foreground">
                    {filteredSegments.length}
                  </span>
                )}
              </div>
            </div>

            <div className="p-5 space-y-3 max-h-[600px] overflow-y-auto">
              {filteredSegments.map((seg) => {
                const speaker = session.speakers.find((s) => s.id === seg.speakerId) ?? session.speakers[0];
                return (
                  <div key={seg.id} className="group flex gap-4">
                    {view !== "polished" && (
                      <div className="w-24 shrink-0">
                        {view === "timestamp" ? (
                          <span className="font-mono tabular text-[11px] text-muted-foreground">{formatTC(seg.start)}</span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-xs">
                            <span className="size-2 rounded-full" style={{ background: speaker.color }} />
                            <span className="text-foreground/80">{speaker.name}</span>
                          </span>
                        )}
                      </div>
                    )}
                    <p className={cn("text-[15px] leading-relaxed flex-1", find && seg.text.toLowerCase().includes(find.toLowerCase()) && "bg-accent/10 rounded")}>
                      {seg.text}
                    </p>
                  </div>
                );
              })}
              {filteredSegments.length === 0 && (
                <p className="text-center text-sm text-muted-foreground py-8">No matches for "{find}".</p>
              )}
            </div>
          </section>

          {/* Footer actions */}
          <div className="flex flex-wrap items-center gap-2 pb-6">
            <PendingButton variant="outline" onAction={() => {}} toastMessage="Follow-up draft ready in your email client">
              <Mail className="size-4" /> Draft email
            </PendingButton>
            <PendingButton variant="outline" onAction={() => navigator.clipboard?.writeText(session.segments.map((s) => s.text).join("\n"))} toastMessage="Transcript copied">
              <Copy className="size-4" /> Copy transcript
            </PendingButton>
            <PendingButton variant="outline" onAction={() => {}} toastMessage="Downloaded session.md">
              <Download className="size-4" /> Download .md
            </PendingButton>
            <PendingButton variant="outline" onAction={() => {}} toastMessage="Downloaded session.txt">
              <Download className="size-4" /> Download .txt
            </PendingButton>
            <div className="ml-auto">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" className="text-destructive hover:text-destructive"><Trash2 className="size-4" /> Delete</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete this session?</AlertDialogTitle>
                    <AlertDialogDescription>The session and its transcript will be moved to the Recycle bin for 30 days.</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => toast.success("Session moved to Recycle bin", { action: { label: "Undo", onClick: () => toast("Restored") } })}>Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>

        {/* Right rail */}
        <aside className="space-y-6">
          <SpeakersPanel session={session} />
          <SharePanel e2ee={e2ee} setE2ee={setE2ee} expiry={expiry} setExpiry={setExpiry} sessionId={session.id} />
          {session.visualMoments && session.visualMoments > 0 && <VisualMoments count={session.visualMoments} />}
        </aside>
      </div>
    </div>
  );
}

function TagPicker({ session }: { session: Session }) {
  const [tags, setTags] = useState(session.tags);
  const [newTag, setNewTag] = useState("");
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="inline-flex items-center gap-1.5 rounded-md border border-hairline bg-surface-1 px-3 h-9 text-xs hover:bg-surface-2">
          {tags.length > 0 ? (
            <span className="flex items-center gap-1">
              {tags.map((t) => <span key={t} className="rounded-full bg-surface-2 px-2 py-0.5">{t}</span>)}
            </span>
          ) : "Add tags"}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-64" align="end">
        <p className="text-xs text-muted-foreground">Session tags</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {tags.map((t) => (
            <span key={t} className="inline-flex items-center gap-1 rounded-full bg-surface-2 px-2 py-0.5 text-xs">
              {t}<button onClick={() => { setTags(tags.filter((x) => x !== t)); toast("Tag removed"); }} aria-label="Remove"><span className="text-muted-foreground">×</span></button>
            </span>
          ))}
        </div>
        <div className="mt-3 flex gap-2">
          <Input value={newTag} onChange={(e) => setNewTag(e.target.value)} placeholder="New tag" className="h-8" />
          <Button size="sm" onClick={() => { if (newTag) { setTags([...tags, newTag]); setNewTag(""); toast.success("Tag added"); } }}>Add</Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function SpeakersPanel({ session }: { session: Session }) {
  const [speakers, setSpeakers] = useState(session.speakers);
  const [diarizing, setDiarizing] = useState(false);
  return (
    <section className="rounded-lg border border-hairline bg-card">
      <div className="border-b border-hairline px-5 py-3">
        <h2 className="font-serif text-lg">Speakers</h2>
      </div>
      <div className="p-5 space-y-3">
        {speakers.map((sp, i) => (
          <div key={sp.id} className="flex items-center gap-3">
            <span className="size-4 rounded-full shrink-0" style={{ background: sp.color }} />
            <Input
              value={sp.name}
              onChange={(e) => setSpeakers((sps) => sps.map((s, j) => (j === i ? { ...s, name: e.target.value } : s)))}
              onBlur={() => toast.success("Speaker renamed")}
              className="h-8 border-0 shadow-none px-0 bg-transparent focus-visible:ring-0"
            />
            <User className="size-3.5 text-muted-foreground" aria-hidden />
          </div>
        ))}
        <PendingButton
          variant="outline" size="sm" className="w-full mt-2"
          pendingLabel="Running diarization…"
          onAction={async () => { setDiarizing(true); await new Promise((r) => setTimeout(r, 1200)); setDiarizing(false); }}
          toastMessage="Diarization complete"
          simulateMs={1200}
        >
          Run acoustic diarization
        </PendingButton>
        {diarizing && <p className="text-xs text-muted-foreground text-center">Analyzing audio…</p>}
      </div>
    </section>
  );
}

function SharePanel({ e2ee, setE2ee, expiry, setExpiry, sessionId }: { e2ee: boolean; setE2ee: (v: boolean) => void; expiry: string; setExpiry: (v: string) => void; sessionId: string }) {
  const link = `https://noto.app/s/${sessionId}-tk4z9${e2ee ? "#k=aB3xY9Q_p2mLwN" : ""}`;
  return (
    <section className="rounded-lg border border-hairline bg-card">
      <div className="border-b border-hairline px-5 py-3 flex items-center gap-2">
        <Link2 className="size-4" aria-hidden />
        <h2 className="font-serif text-lg">Share</h2>
      </div>
      <div className="p-5 space-y-4">
        <div className="rounded-md bg-surface-2 px-3 py-2 font-mono text-[11px] break-all">{link}</div>
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-sm">Expires in</Label>
            <p className="text-xs text-muted-foreground mt-0.5">Link becomes invalid after this.</p>
          </div>
          <Select value={expiry} onValueChange={setExpiry}>
            <SelectTrigger className="w-[110px] h-8"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="1h">1 hour</SelectItem>
              <SelectItem value="24h">24 hours</SelectItem>
              <SelectItem value="7d">7 days</SelectItem>
              <SelectItem value="never">Never</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="size-3.5 text-accent" aria-hidden />
              <Label className="text-sm">End-to-end encrypted</Label>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">Key lives only in the URL fragment.</p>
          </div>
          <Switch checked={e2ee} onCheckedChange={setE2ee} />
        </div>
        <PendingButton
          className="w-full" size="sm"
          onAction={() => navigator.clipboard?.writeText(link)}
          toastMessage="Share link copied"
        >
          <Copy className="size-4" /> Copy link
        </PendingButton>
      </div>
    </section>
  );
}

function VisualMoments({ count }: { count: number }) {
  return (
    <section className="rounded-lg border border-hairline bg-card">
      <div className="border-b border-hairline px-5 py-3">
        <h2 className="font-serif text-lg">Visual moments</h2>
      </div>
      <div className="p-5">
        <div className="grid grid-cols-3 gap-2">
          {Array.from({ length: count }).map((_, i) => (
            <Tooltip key={i}>
              <TooltipTrigger asChild>
                <button className="aspect-video rounded-md bg-gradient-to-br from-surface-2 to-surface-3 border border-hairline hover:border-accent transition-colors" aria-label={`Moment ${i + 1}`} />
              </TooltipTrigger>
              <TooltipContent>{formatTC((i + 1) * 240)}</TooltipContent>
            </Tooltip>
          ))}
        </div>
      </div>
    </section>
  );
}

function formatTC(sec: number) {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  const mm = m.toString().padStart(2, "0");
  const ss = s.toString().padStart(2, "0");
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}
