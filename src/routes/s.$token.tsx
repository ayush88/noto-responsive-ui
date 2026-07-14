import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { sessions } from "@/lib/mock/data";
import { Wordmark, Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShieldCheck, Lock, Send } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

export const Route = createFileRoute("/s/$token")({
  head: () => ({ meta: [{ title: "Shared session · NoTo" }, { name: "description", content: "Read-only shared session." }, { name: "robots", content: "noindex" }] }),
  component: Shared,
});

function Shared() {
  const [e2ee, setE2ee] = useState(false);
  const [remaining, setRemaining] = useState(3);
  const [asking, setAsking] = useState(false);
  const [q, setQ] = useState("");
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; text: string }[]>([]);
  const session = sessions[0]; // demo

  useEffect(() => {
    if (typeof window !== "undefined") {
      setE2ee(window.location.hash.startsWith("#k="));
    }
  }, []);

  const ask = async () => {
    if (!q.trim() || remaining === 0) return;
    setMessages((m) => [...m, { role: "user", text: q }]);
    setQ("");
    setAsking(true);
    await new Promise((r) => setTimeout(r, 800));
    setMessages((m) => [...m, { role: "assistant", text: "The team agreed to ship the redesigned onboarding welcome flow on the 15th, and to send Acme an annual pricing proposal by Friday." }]);
    setRemaining((r) => r - 1);
    setAsking(false);
  };

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <header className="border-b border-hairline">
        <div className="mx-auto max-w-3xl px-4 md:px-6 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2"><Logo size={22} /><Wordmark /></Link>
          <Link to="/app" className="text-sm inline-flex items-center h-9 rounded-md bg-foreground text-background px-3 hover:opacity-90">Try NoTo</Link>
        </div>
      </header>

      {e2ee && (
        <div className="border-b border-hairline bg-surface-1">
          <div className="mx-auto max-w-3xl px-4 md:px-6 py-3 flex items-center gap-3">
            <ShieldCheck className="size-4 text-accent shrink-0" aria-hidden />
            <p className="text-sm">
              <strong>End-to-end encrypted.</strong> Only people with the link + key can read this session. NoTo can't.
            </p>
          </div>
        </div>
      )}

      <main className="mx-auto max-w-3xl px-4 md:px-6 py-8 md:py-12">
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Shared session · Read only</p>
        <h1 className="mt-2 font-serif text-4xl">{session.title}</h1>
        <p className="mt-1 text-sm text-muted-foreground font-mono tabular">
          {format(session.createdAt, "MMM d, yyyy")} · {Math.round(session.durationSec / 60)} min · {session.segments.length} segments
        </p>

        <section className="mt-8 rounded-lg border border-hairline bg-card p-6">
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Summary</p>
          <p className="mt-3 text-[15px] leading-relaxed">{session.tldr}</p>
          <ul className="mt-5 space-y-2">
            {session.keyPoints.map((k, i) => (
              <li key={i} className="flex gap-3 text-sm"><span className="mt-2 size-1 rounded-full bg-accent shrink-0" />{k}</li>
            ))}
          </ul>
        </section>

        {!e2ee && (
          <section className="mt-6 rounded-lg border border-hairline bg-card p-6">
            <div className="flex items-center justify-between gap-3">
              <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Ask this session</p>
              <span className="text-[11px] font-mono text-muted-foreground">{remaining} questions left</span>
            </div>
            <div className="mt-4 space-y-3">
              {messages.map((m, i) => (
                <div key={i} className={m.role === "user" ? "text-right" : ""}>
                  <div className={`inline-block max-w-[85%] rounded-lg px-3 py-2 text-sm ${m.role === "user" ? "bg-foreground text-background" : "bg-surface-2"}`}>{m.text}</div>
                </div>
              ))}
              {asking && <p className="text-xs text-muted-foreground">Thinking…</p>}
            </div>
            <div className="mt-4 flex gap-2">
              <Input value={q} onChange={(e) => setQ(e.target.value)} disabled={remaining === 0} onKeyDown={(e) => e.key === "Enter" && ask()} placeholder={remaining === 0 ? "Question limit reached" : "Ask something…"} />
              <Button onClick={ask} disabled={!q.trim() || remaining === 0 || asking}><Send className="size-4" /></Button>
            </div>
          </section>
        )}

        <section className="mt-6 rounded-lg border border-hairline bg-card p-6">
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Transcript</p>
          <div className="mt-4 space-y-3 max-h-[500px] overflow-y-auto">
            {session.segments.slice(0, 20).map((seg) => {
              const sp = session.speakers.find((s) => s.id === seg.speakerId) ?? session.speakers[0];
              return (
                <div key={seg.id} className="flex gap-4">
                  <span className="w-24 shrink-0 text-xs">
                    <span className="inline-flex items-center gap-1.5">
                      <span className="size-2 rounded-full" style={{ background: sp.color }} />
                      {sp.name}
                    </span>
                  </span>
                  <p className="text-[15px] leading-relaxed flex-1">{seg.text}</p>
                </div>
              );
            })}
          </div>
        </section>

        <footer className="mt-10 flex items-center gap-2 text-xs text-muted-foreground">
          <Lock className="size-3" aria-hidden />
          Shared with NoTo · <button onClick={() => toast("Reported")} className="underline underline-offset-2">Report</button>
        </footer>
      </main>
    </div>
  );
}
