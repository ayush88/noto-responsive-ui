import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useCallback, useEffect } from "react";
import { Upload, Chrome, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/import")({
  head: () => ({ meta: [{ title: "Import · NoTo" }, { name: "description", content: "Import audio into NoTo." }] }),
  component: Import,
});

const PHASES = ["Create", "Upload", "Transcribe", "Done"] as const;

function Import() {
  const navigate = useNavigate();
  const [file, setFile] = useState<{ name: string; sizeMB: number } | null>(null);
  const [phase, setPhase] = useState(-1);
  const [dragOver, setDragOver] = useState(false);
  const [startTs, setStartTs] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (startTs === null || phase >= PHASES.length) return;
    const timer = setInterval(() => setElapsed(Math.floor((Date.now() - startTs) / 1000)), 250);
    return () => clearInterval(timer);
  }, [startTs, phase]);

  useEffect(() => {
    if (phase < 0 || phase >= PHASES.length - 1) return;
    const durations = [800, 2200, 3200];
    const t = setTimeout(() => setPhase((p) => p + 1), durations[phase] ?? 1000);
    return () => clearTimeout(t);
  }, [phase]);

  useEffect(() => {
    if (phase === PHASES.length - 1) {
      toast.success(`Imported ${file?.name ?? "audio"}`, { description: "Opening the new session…" });
      const t = setTimeout(() => navigate({ to: "/app" }), 1200);
      return () => clearTimeout(t);
    }
  }, [phase, file, navigate]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) start(f.name, f.size / 1024 / 1024);
  }, []);

  const start = (name: string, sizeMB: number) => {
    setFile({ name, sizeMB: Math.round(sizeMB * 10) / 10 });
    setStartTs(Date.now());
    setPhase(0);
  };

  const cancel = () => {
    setPhase(-1);
    setFile(null);
    setStartTs(null);
    toast("Import cancelled");
  };

  return (
    <div className="mx-auto max-w-3xl px-4 md:px-6 py-8 md:py-12">
      <div>
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Bring your audio</p>
        <h1 className="mt-2 font-serif text-4xl">Import</h1>
        <p className="mt-2 text-sm text-muted-foreground">Drop a file, or use the Chrome extension to capture tab audio directly.</p>
      </div>

      {phase < 0 ? (
        <>
          <label
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
            className={cn(
              "mt-8 flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed p-16 text-center cursor-pointer transition-colors",
              dragOver ? "border-accent bg-accent/5" : "border-hairline bg-surface-1 hover:bg-surface-2",
            )}
          >
            <Upload className="size-8 text-muted-foreground" aria-hidden />
            <p className="font-serif text-2xl">Drop audio here</p>
            <p className="text-sm text-muted-foreground">or click to browse · .mp3, .wav, .m4a, .webm up to 500MB</p>
            <input
              type="file"
              accept="audio/*"
              className="sr-only"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) start(f.name, f.size / 1024 / 1024);
              }}
            />
          </label>

          <div className="mt-6 rounded-lg border border-hairline bg-card p-5 flex items-start gap-4">
            <Chrome className="size-5 mt-0.5 text-muted-foreground" aria-hidden />
            <div className="flex-1">
              <p className="font-medium text-sm">Get the Chrome extension</p>
              <p className="text-xs text-muted-foreground mt-1">Capture Zoom, Meet or any tab's audio without leaving your browser.</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => toast.success("Opening Chrome Web Store")}>Install</Button>
          </div>

          <div className="mt-6 flex justify-center">
            <Button variant="outline" onClick={() => start("interview-acme.mp3", 42.6)}>
              Try with sample audio
            </Button>
          </div>
        </>
      ) : (
        <div className="mt-8 rounded-lg border border-hairline bg-card p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-medium">{file?.name}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{file?.sizeMB} MB · elapsed <span className="font-mono tabular">{elapsed}s</span></p>
            </div>
            {phase < PHASES.length - 1 && (
              <Button variant="ghost" size="sm" onClick={cancel}><X className="size-4" /> Cancel</Button>
            )}
          </div>

          <div className="mt-6">
            <div className="flex items-center gap-2">
              {PHASES.map((p, i) => (
                <div key={p} className="flex-1">
                  <div className={cn(
                    "h-1.5 rounded-full",
                    i < phase ? "bg-accent" : i === phase ? "bg-accent animate-pulse-dot" : "bg-hairline",
                  )} />
                </div>
              ))}
            </div>
            <div className="mt-3 grid grid-cols-4 gap-2 text-xs">
              {PHASES.map((p, i) => (
                <div key={p} className={cn(
                  "flex items-center gap-1.5 font-mono uppercase tracking-widest",
                  i <= phase ? "text-foreground" : "text-muted-foreground",
                )}>
                  {i < phase || phase === PHASES.length - 1 ? <Check className="size-3 text-accent" /> : <span className="size-3 rounded-full border border-current" />}
                  {p}
                </div>
              ))}
            </div>
          </div>

          <p className="mt-6 text-sm text-muted-foreground">
            {phase === 0 && "Creating session record…"}
            {phase === 1 && "Uploading audio to local store…"}
            {phase === 2 && "Transcribing with Whisper Small · this happens on-device."}
            {phase === PHASES.length - 1 && "Done. Opening your new session…"}
          </p>
        </div>
      )}
    </div>
  );
}
