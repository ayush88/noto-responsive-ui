import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Mic, Square, Pause, Play, Settings2, Copy, X, AlertTriangle, Sparkles, Wand2 } from "lucide-react";
import { Waveform } from "@/components/app/waveform";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export const Route = createFileRoute("/app/record")({
  head: () => ({ meta: [{ title: "Record · NoTo" }, { name: "description", content: "Capture and transcribe on-device." }] }),
  component: Record,
});

type State = "idle" | "recording" | "paused";

const LIVE_LINES = [
  { speaker: "You", text: "Okay, let's start with the retention numbers for last quarter." },
  { speaker: "Priya", text: "Right — day-two drop-off is still forty-two percent, which lines up with what we saw in Q2." },
  { speaker: "You", text: "So the second-day email is the culprit. I want to ship the redesigned welcome flow before the marketing push." },
  { speaker: "Priya", text: "Agreed. Let's target the fifteenth so QA gets a full week." },
  { speaker: "You", text: "One more thing — Acme raised the annual billing question again." },
  { speaker: "Priya", text: "I told them we'd have an answer by Friday. Can you draft the proposal?" },
];

function Record() {
  const [state, setState] = useState<State>("idle");
  const [elapsed, setElapsed] = useState(0);
  const [transcript, setTranscript] = useState<{ speaker: string; text: string; t: number }[]>([]);
  const [micError, setMicError] = useState(false);
  const [showCrashBanner, setShowCrashBanner] = useState(true);
  const [model, setModel] = useState("small");
  const [lang, setLang] = useState("en");
  const [template, setTemplate] = useState("meeting");
  const [vocab, setVocab] = useState<string[]>(["Acme", "Priya", "NoTo", "RAG"]);
  const [newVocab, setNewVocab] = useState("");
  const lineIdxRef = useRef(0);

  useEffect(() => {
    if (state !== "recording") return;
    const timer = setInterval(() => setElapsed((e) => e + 1), 1000);
    const lineTimer = setInterval(() => {
      const line = LIVE_LINES[lineIdxRef.current % LIVE_LINES.length];
      lineIdxRef.current += 1;
      setTranscript((t) => [...t, { ...line, t: elapsed }]);
    }, 3200);
    return () => { clearInterval(timer); clearInterval(lineTimer); };
  }, [state, elapsed]);

  const start = () => {
    setState("recording");
    toast.success("Recording started · transcribing on-device");
  };
  const pause = () => { setState("paused"); toast("Paused"); };
  const resume = () => { setState("recording"); toast("Resumed"); };
  const stop = () => {
    setState("idle");
    toast.success("Session saved to Library", { description: `${formatTime(elapsed)} captured` });
    setElapsed(0);
    setTranscript([]);
    lineIdxRef.current = 0;
  };

  if (micError) {
    return (
      <div className="mx-auto max-w-2xl px-4 md:px-6 py-16 text-center">
        <div className="inline-flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <AlertTriangle className="size-5" />
        </div>
        <h1 className="mt-4 font-serif text-3xl">Microphone unavailable</h1>
        <p className="mt-3 text-muted-foreground">
          NoTo can't reach your microphone. Check your browser permissions, or try importing an audio file instead.
        </p>
        <div className="mt-6 flex justify-center gap-2">
          <Button variant="outline" onClick={() => setMicError(false)}>Retry</Button>
          <Button asChild><a href="/app/import">Import audio</a></Button>
        </div>
        <div className="mt-8 text-left text-sm text-muted-foreground space-y-1 max-w-md mx-auto">
          <p>· Click the padlock in your address bar → Microphone → Allow</p>
          <p>· On macOS, check System Settings → Privacy → Microphone</p>
          <p>· Reload this page after granting access</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 md:px-6 py-6 md:py-10">
      {showCrashBanner && state === "idle" && (
        <div className="mb-6 flex items-start gap-3 rounded-lg border border-hairline bg-surface-1 p-4">
          <div className="mt-0.5 size-2 rounded-full bg-warning" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium">Unfinished session found from yesterday</p>
            <p className="text-xs text-muted-foreground mt-1">"Q3 board prep" · 18m 04s captured before the tab closed.</p>
          </div>
          <Button size="sm" variant="outline" onClick={() => toast.success("Resuming session")}>Resume</Button>
          <button onClick={() => setShowCrashBanner(false)} aria-label="Dismiss" className="p-1 text-muted-foreground hover:text-foreground">
            <X className="size-4" />
          </button>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div>
          <div className="rounded-xl border border-hairline bg-card p-6 md:p-10 text-center">
            <div className="flex items-center justify-center gap-2 text-xs">
              <span className={`size-2 rounded-full ${state === "recording" ? "bg-accent animate-pulse-dot" : state === "paused" ? "bg-warning" : "bg-muted-foreground/50"}`} />
              <span className="font-mono uppercase tracking-widest text-muted-foreground">
                {state === "recording" ? "Recording" : state === "paused" ? "Paused" : "Ready"}
              </span>
            </div>
            <p className="mt-3 font-serif text-6xl md:text-7xl tabular">{formatTime(elapsed)}</p>
            <div className="mt-8 rounded-md bg-surface-2 p-6">
              <Waveform seed={"rec-" + elapsed} bars={64} playing={state === "recording"} height={80} />
            </div>
            <div className="mt-8 flex items-center justify-center gap-4">
              {state === "idle" && (
                <button
                  onClick={start}
                  aria-label="Start recording"
                  className="grid size-20 place-items-center rounded-full bg-accent text-accent-foreground shadow-lg hover:opacity-95 active:scale-95 transition-all"
                >
                  <Mic className="size-8" />
                </button>
              )}
              {state === "recording" && (
                <>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button onClick={pause} aria-label="Pause" className="grid size-14 place-items-center rounded-full border border-hairline bg-surface-1 hover:bg-surface-2">
                        <Pause className="size-5" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>Pause</TooltipContent>
                  </Tooltip>
                  <button onClick={stop} aria-label="Stop recording" className="grid size-20 place-items-center rounded-full bg-foreground text-background shadow-lg hover:opacity-95 active:scale-95 transition-all">
                    <Square className="size-7" />
                  </button>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button aria-label="Test mic" onClick={() => setMicError(true)} className="grid size-14 place-items-center rounded-full border border-hairline bg-surface-1 hover:bg-surface-2">
                        <Wand2 className="size-5" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>Simulate mic error</TooltipContent>
                  </Tooltip>
                </>
              )}
              {state === "paused" && (
                <>
                  <button onClick={resume} aria-label="Resume" className="grid size-20 place-items-center rounded-full bg-accent text-accent-foreground shadow-lg">
                    <Play className="size-7" />
                  </button>
                  <button onClick={stop} aria-label="Stop" className="grid size-14 place-items-center rounded-full border border-hairline bg-surface-1">
                    <Square className="size-5" />
                  </button>
                </>
              )}
            </div>
            <div className="mt-6 flex items-center justify-center gap-3 text-xs text-muted-foreground">
              <span className="font-mono">Whisper · {model[0].toUpperCase() + model.slice(1)}</span>
              <span>·</span>
              <span>{lang === "en" ? "English" : lang.toUpperCase()}</span>
              <span>·</span>
              <SettingsSheet {...{ model, setModel, lang, setLang, template, setTemplate, vocab, setVocab, newVocab, setNewVocab }} />
            </div>
          </div>

          {/* Live transcript */}
          <div className="mt-6 rounded-lg border border-hairline bg-card p-6">
            <h2 className="text-sm font-medium text-muted-foreground">Live transcript</h2>
            {transcript.length === 0 ? (
              <p className="mt-6 text-center text-sm text-muted-foreground">
                {state === "idle" ? "Hit record to begin. Words appear here as you speak." : "Listening…"}
              </p>
            ) : (
              <div className="mt-4 space-y-4">
                {transcript.map((line, i) => (
                  <div key={i} className="animate-rise-in">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className={`size-2 rounded-full ${line.speaker === "You" ? "bg-foreground" : "bg-accent"}`} />
                      <span className="font-medium text-foreground">{line.speaker}</span>
                      <span className="font-mono tabular">{formatTime(line.t)}</span>
                    </div>
                    <p className="mt-1 text-foreground/90 leading-relaxed">{line.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Live copilot */}
        <aside className="lg:sticky lg:top-20 h-fit">
          <div className="rounded-lg border border-hairline bg-card p-5">
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-accent" aria-hidden />
              <h2 className="text-sm font-medium">Live Copilot</h2>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">Contextual prompts from the live transcript.</p>
            <div className="mt-4 space-y-3">
              {[
                "Ask what Acme's annual budget looks like",
                "Follow up on the QA timeline commitment",
                "Bring up the second-day email A/B test",
                "Confirm ownership of the annual proposal draft",
              ].map((s, i) => (
                <div key={i} className="group flex items-start gap-2 rounded-md border border-hairline bg-surface-1 p-3">
                  <p className="text-sm flex-1">{s}</p>
                  <button
                    onClick={() => { navigator.clipboard?.writeText(s); toast.success("Copied to clipboard"); }}
                    className="opacity-60 hover:opacity-100 p-1"
                    aria-label="Copy suggestion"
                  >
                    <Copy className="size-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function formatTime(sec: number) {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  const mm = m.toString().padStart(2, "0");
  const ss = s.toString().padStart(2, "0");
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}

function SettingsSheet({
  model, setModel, lang, setLang, template, setTemplate, vocab, setVocab, newVocab, setNewVocab,
}: {
  model: string; setModel: (v: string) => void;
  lang: string; setLang: (v: string) => void;
  template: string; setTemplate: (v: string) => void;
  vocab: string[]; setVocab: (v: string[]) => void;
  newVocab: string; setNewVocab: (v: string) => void;
}) {
  const tiers = [
    { id: "tiny", label: "Tiny", speed: 5, acc: 2 },
    { id: "base", label: "Base", speed: 4, acc: 3 },
    { id: "small", label: "Small", speed: 3, acc: 4 },
    { id: "medium", label: "Medium", speed: 2, acc: 5 },
  ];
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="inline-flex items-center gap-1 rounded-md border border-hairline px-2 h-7 text-xs hover:bg-surface-2">
          <Settings2 className="size-3.5" /> Settings
        </button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="font-serif text-2xl">Recording settings</SheetTitle>
          <SheetDescription>These apply to this session and future recordings.</SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-6 px-4 pb-8">
          <div>
            <Label>Whisper model tier</Label>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {tiers.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setModel(t.id)}
                  className={`rounded-md border p-3 text-left ${model === t.id ? "border-accent bg-accent/5" : "border-hairline hover:bg-surface-2"}`}
                >
                  <div className="text-sm font-medium">{t.label}</div>
                  <div className="mt-2 flex items-center gap-1 text-[10px] font-mono text-muted-foreground">
                    <span>SPEED</span>
                    <Bars n={t.speed} />
                  </div>
                  <div className="mt-1 flex items-center gap-1 text-[10px] font-mono text-muted-foreground">
                    <span>ACC.</span>
                    <Bars n={t.acc} />
                  </div>
                </button>
              ))}
            </div>
          </div>
          <div>
            <Label>Language</Label>
            <Select value={lang} onValueChange={setLang}>
              <SelectTrigger className="mt-2"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="auto">Auto-detect</SelectItem>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Spanish</SelectItem>
                <SelectItem value="fr">French</SelectItem>
                <SelectItem value="de">German</SelectItem>
                <SelectItem value="pt">Portuguese</SelectItem>
                <SelectItem value="ja">Japanese</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Summary template</Label>
            <Select value={template} onValueChange={setTemplate}>
              <SelectTrigger className="mt-2"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="meeting">Meeting</SelectItem>
                <SelectItem value="lecture">Lecture</SelectItem>
                <SelectItem value="interview">Interview</SelectItem>
                <SelectItem value="oneone">1:1</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Custom vocabulary</Label>
            <p className="text-xs text-muted-foreground mt-1">Names and terms Whisper should recognize.</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {vocab.map((v) => (
                <span key={v} className="inline-flex items-center gap-1 rounded-full bg-surface-2 px-2.5 py-1 text-xs">
                  {v}
                  <button onClick={() => setVocab(vocab.filter((x) => x !== v))} aria-label={`Remove ${v}`}>
                    <X className="size-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="mt-3 flex gap-2">
              <Input placeholder="Add term…" value={newVocab} onChange={(e) => setNewVocab(e.target.value)} />
              <Button variant="outline" onClick={() => { if (newVocab) { setVocab([...vocab, newVocab]); setNewVocab(""); toast.success("Added to vocabulary"); } }}>
                Add
              </Button>
            </div>
          </div>
          <div>
            <Label>Input gain</Label>
            <Slider defaultValue={[70]} max={100} step={1} className="mt-3" />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function Bars({ n }: { n: number }) {
  return (
    <span className="inline-flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={`inline-block w-1.5 h-2 rounded-sm ${i < n ? "bg-accent" : "bg-hairline"}`} />
      ))}
    </span>
  );
}
