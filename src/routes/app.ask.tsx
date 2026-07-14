import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Sparkles, Trash2 } from "lucide-react";
import { sessions } from "@/lib/mock/data";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/app/ask")({
  head: () => ({ meta: [{ title: "Ask NoTo · NoTo" }, { name: "description", content: "Chat over your entire library." }] }),
  component: Ask,
});

type Msg = { role: "user" | "assistant"; text: string; citations?: { sessionId: string; time: number; title: string }[] };

const examples = [
  "What did I commit to last week?",
  "Summarize all 1:1s with Priya",
  "Open action items across everything",
  "What did the customer say about pricing?",
];

function Ask() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);

  const send = async (q?: string) => {
    const query = q ?? input;
    if (!query.trim()) return;
    setMessages((m) => [...m, { role: "user", text: query }]);
    setInput("");
    setPending(true);
    await new Promise((r) => setTimeout(r, 900));
    setMessages((m) => [...m, {
      role: "assistant",
      text: `Across your last week's sessions, you committed to: (1) send the annual pricing proposal to Acme by Friday, (2) ship the redesigned onboarding welcome flow on the 15th, and (3) circulate the board deck first draft Tuesday evening. Two open action items from prior weeks are still unresolved.`,
      citations: [
        { sessionId: sessions[0].id, time: 720, title: sessions[0].title },
        { sessionId: sessions[2].id, time: 1240, title: sessions[2].title },
      ],
    }]);
    setPending(false);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 md:px-6 py-6 md:py-10 flex flex-col min-h-[calc(100dvh-8rem)]">
      <div className="flex items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-2">
          <Sparkles className="size-5 text-accent" aria-hidden />
          <h1 className="font-serif text-3xl">Ask NoTo</h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full border border-hairline px-2 py-0.5 text-[11px] font-mono text-muted-foreground">Model · Auto</span>
          {messages.length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="sm"><Trash2 className="size-4" /> Clear</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Clear chat history?</AlertDialogTitle>
                  <AlertDialogDescription>This won't affect your sessions — only this conversation.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => { setMessages([]); toast.success("Chat cleared"); }}>Clear</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>

      <div className="flex-1 space-y-4">
        {messages.length === 0 ? (
          <div>
            <p className="text-sm text-muted-foreground">Ask anything across your entire library. Every answer cites the exact session and moment.</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {examples.map((q) => (
                <button
                  key={q}
                  onClick={() => send(q)}
                  className="rounded-lg border border-hairline bg-card p-4 text-left hover:border-foreground/25 transition-colors"
                >
                  <p className="text-sm font-medium">{q}</p>
                  <p className="mt-2 text-xs text-muted-foreground">Search across all 15 sessions</p>
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((m, i) => (
            <div key={i} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
              <div className={cn(
                "max-w-[85%] rounded-lg px-4 py-2.5",
                m.role === "user" ? "bg-foreground text-background" : "bg-transparent",
              )}>
                <p className="text-[15px] leading-relaxed">{m.text}</p>
                {m.citations && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {m.citations.map((c, ci) => (
                      <Link
                        key={ci}
                        to="/app/sessions/$id"
                        params={{ id: c.sessionId }}
                        className="inline-flex items-center gap-1.5 rounded-md border border-hairline bg-card px-2 py-1 text-xs hover:border-accent"
                      >
                        <span className="truncate max-w-[180px]">{c.title}</span>
                        <span className="font-mono tabular text-muted-foreground">{formatTC(c.time)}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
        {pending && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="size-2 rounded-full bg-accent animate-pulse-dot" />
            Searching your library…
          </div>
        )}
      </div>

      <div className="sticky bottom-24 md:bottom-6 mt-6 flex gap-2">
        <Input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder="Ask about your recordings…" className="h-12 text-base" />
        <Button onClick={() => send()} disabled={!input.trim() || pending} className="h-12 px-4">
          <Send className="size-4" />
        </Button>
      </div>
    </div>
  );
}

function formatTC(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}
