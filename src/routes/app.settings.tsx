import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PendingButton } from "@/components/app/pending-button";
import { Waveform } from "@/components/app/waveform";
import { invoices, usage } from "@/lib/mock/data";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Check, Download, Mic, Trash2 } from "lucide-react";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/app/settings")({
  head: () => ({ meta: [{ title: "Settings · NoTo" }, { name: "description", content: "Your NoTo preferences." }] }),
  component: Settings,
});

const SECTIONS = [
  { id: "about", label: "About you" },
  { id: "llm", label: "LLM preference" },
  { id: "digest", label: "Digest email" },
  { id: "retention", label: "Audio retention" },
  { id: "calendar", label: "Calendar" },
  { id: "todo", label: "Todo integrations" },
  { id: "writing", label: "Writing style" },
  { id: "phone", label: "Phone numbers" },
  { id: "push", label: "Push notifications" },
  { id: "billing", label: "Billing" },
  { id: "speakers", label: "Speaker enrollment" },
  { id: "export", label: "Download library" },
  { id: "account", label: "Account" },
];

function Settings() {
  const [active, setActive] = useState("about");
  const [llm, setLlm] = useState("auto");

  return (
    <div className="mx-auto max-w-6xl px-4 md:px-6 py-8">
      <div>
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Preferences</p>
        <h1 className="mt-2 font-serif text-4xl">Settings</h1>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[220px_1fr]">
        <nav className="hidden lg:block sticky top-20 h-fit">
          <ul className="space-y-0.5">
            {SECTIONS.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  onClick={() => setActive(s.id)}
                  className={cn(
                    "block rounded-md px-3 py-1.5 text-sm",
                    active === s.id ? "bg-surface-2 text-foreground" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="space-y-8">
          <Section id="about" title="About you">
            <p className="text-sm text-muted-foreground">Give NoTo context so summaries and prompts feel like you.</p>
            <Textarea rows={4} defaultValue="I'm a product manager at a mid-stage SaaS. I record 1:1s, customer interviews and design reviews. I prefer concise summaries with clear action items." className="mt-3" />
            <PendingButton className="mt-3" onAction={() => {}} toastMessage="Profile saved">Save</PendingButton>
          </Section>

          <Section id="llm" title="LLM preference">
            <p className="text-sm text-muted-foreground">Choose the model NoTo uses to summarize, ask, and draft.</p>
            <RadioGroup value={llm} onValueChange={setLlm} className="mt-4 grid gap-2 sm:grid-cols-2">
              {[
                { id: "auto", name: "Auto", desc: "Best model per task" },
                { id: "gemini", name: "Gemini", desc: "Google · large context" },
                { id: "groq", name: "Groq", desc: "Fastest inference" },
                { id: "openai", name: "OpenAI", desc: "GPT family" },
                { id: "anthropic", name: "Anthropic", desc: "Claude family" },
              ].map((m) => (
                <label key={m.id} className={cn("flex items-start gap-3 rounded-md border p-3 cursor-pointer", llm === m.id ? "border-accent bg-accent/5" : "border-hairline")}>
                  <RadioGroupItem value={m.id} className="mt-1" />
                  <div>
                    <p className="text-sm font-medium">{m.name}</p>
                    <p className="text-xs text-muted-foreground">{m.desc}</p>
                  </div>
                </label>
              ))}
            </RadioGroup>
            <div className="mt-4">
              <Label>API key</Label>
              <div className="mt-2 flex gap-2">
                <Input type="password" defaultValue="sk-•••••••••••••••••••••••••" />
                <PendingButton variant="outline" onAction={() => {}} pendingLabel="Testing…" successLabel="Connected" toastMessage="Key validated">Test connection</PendingButton>
              </div>
            </div>
          </Section>

          <Section id="digest" title="Digest email">
            <Row title="Weekly digest" desc="An email summary of your captured sessions and open tasks."><Switch defaultChecked /></Row>
            <Row title="Cadence">
              <Select defaultValue="weekly">
                <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </Row>
          </Section>

          <Section id="retention" title="Audio retention">
            <Row title="Keep audio locally" desc="Original audio deleted after this period. Transcripts stay forever.">
              <Select defaultValue="90">
                <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 days</SelectItem>
                  <SelectItem value="90">90 days</SelectItem>
                  <SelectItem value="365">1 year</SelectItem>
                  <SelectItem value="forever">Forever</SelectItem>
                </SelectContent>
              </Select>
            </Row>
          </Section>

          <Section id="calendar" title="Calendar integration">
            <Row title="Google Calendar" desc="Auto-name sessions based on your events."><PendingButton variant="outline" size="sm" onAction={() => {}} toastMessage="Google Calendar connected">Connect</PendingButton></Row>
            <Row title="Apple Calendar" desc="Sync events from your Mac and iPhone."><Button variant="outline" size="sm">Connect</Button></Row>
          </Section>

          <Section id="todo" title="Todo integrations">
            <Row title="Todoist"><Button variant="outline" size="sm">Connect</Button></Row>
            <Row title="Linear"><span className="inline-flex items-center gap-1 text-xs text-success"><Check className="size-3" /> Connected</span></Row>
          </Section>

          <Section id="writing" title="Writing style">
            <p className="text-sm text-muted-foreground">Sample text NoTo will mimic when drafting emails and summaries.</p>
            <Textarea rows={4} defaultValue="Hey — quick note. Wanted to flag two things from this morning…" className="mt-3" />
          </Section>

          <Section id="phone" title="Phone numbers">
            <Row title="+1 415 555 0134" desc="Primary · verified"><Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">Remove</Button></Row>
            <div className="mt-4 rounded-md border border-hairline p-4">
              <Label>Add a number</Label>
              <div className="mt-2 flex gap-2"><Input placeholder="+1 415 555 0100" /><Button>Send code</Button></div>
              <p className="mt-3 text-xs text-muted-foreground">You'll receive a 6-digit code by SMS.</p>
            </div>
          </Section>

          <Section id="push" title="Push notifications">
            <Row title="Session ready" desc="When a transcript finishes processing."><Switch defaultChecked /></Row>
            <Row title="Weekly insights" desc="When your weekly summary is ready."><Switch defaultChecked /></Row>
            <Row title="Overdue action items" desc="Two days before an item is due."><Switch /></Row>
          </Section>

          <Section id="billing" title="Billing">
            <div className="rounded-lg border border-hairline bg-surface-1 p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Current plan</p>
                  <p className="mt-1 font-serif text-2xl">Pro · $20/mo</p>
                  <p className="mt-1 text-xs text-muted-foreground">Renews Aug 1, 2026</p>
                </div>
                <Button variant="outline" size="sm">Manage</Button>
              </div>
              <div className="mt-5 space-y-3">
                <UsageBar label="Hours transcribed" used={usage.hoursUsed} limit={usage.hoursLimit} unit="h" />
                <UsageBar label="Sessions" used={usage.sessionsUsed} limit={usage.sessionsLimit} />
              </div>
            </div>
            <div className="mt-6">
              <h3 className="text-sm font-medium">Invoices</h3>
              <div className="mt-2 rounded-md border border-hairline overflow-hidden">
                {invoices.map((inv, i) => (
                  <div key={inv.id} className={cn("flex items-center justify-between px-4 py-3 text-sm", i > 0 && "border-t border-hairline")}>
                    <span className="font-mono">{inv.id}</span>
                    <span className="text-muted-foreground">{inv.date}</span>
                    <span className="tabular font-mono">{inv.amount}</span>
                    <span className="text-success text-xs">{inv.status}</span>
                    <button className="text-muted-foreground hover:text-foreground" aria-label="Download invoice"><Download className="size-4" /></button>
                  </div>
                ))}
              </div>
            </div>
          </Section>

          <Section id="speakers" title="Speaker enrollment">
            <p className="text-sm text-muted-foreground">Record 10 seconds per person so NoTo recognizes them across sessions.</p>
            <div className="mt-4 space-y-3">
              {["Alex Kim (you)", "Priya Shah", "Marcus Bell"].map((name) => (
                <div key={name} className="flex items-center gap-3 rounded-md border border-hairline p-3">
                  <div className="size-9 rounded-full bg-surface-2 grid place-items-center"><Mic className="size-4" /></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{name}</p>
                    <Waveform seed={name} bars={40} height={18} className="mt-1" />
                  </div>
                  <PendingButton size="sm" variant="outline" onAction={() => {}} pendingLabel="Recording…" toastMessage="Voiceprint saved">Record 10s</PendingButton>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" aria-label="Delete voiceprint"><Trash2 className="size-4" /></Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete voiceprint?</AlertDialogTitle>
                        <AlertDialogDescription>NoTo will no longer auto-label this speaker in future sessions.</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => toast.success("Voiceprint deleted")}>Delete</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              ))}
            </div>
          </Section>

          <Section id="export" title="Download my library">
            <p className="text-sm text-muted-foreground">A zipped archive of every session, transcript and summary.</p>
            <PendingButton className="mt-3" variant="outline" onAction={() => {}} pendingLabel="Preparing archive…" toastMessage="Archive ready · check your email">
              <Download className="size-4" /> Request export
            </PendingButton>
          </Section>

          <Section id="account" title="Account">
            <Row title="Email" desc="alex@company.com"><Button variant="outline" size="sm">Change</Button></Row>
            <div className="mt-6 rounded-md border border-destructive/30 bg-destructive/5 p-4">
              <p className="text-sm font-medium">Delete account</p>
              <p className="text-xs text-muted-foreground mt-1">Permanently delete your NoTo account and all local data.</p>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="mt-3 text-destructive hover:text-destructive">Delete account</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete your NoTo account?</AlertDialogTitle>
                    <AlertDialogDescription>This is permanent. Your sessions, transcripts and settings will be erased.</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => toast.success("Account scheduled for deletion")}>Delete forever</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="rounded-lg border border-hairline bg-card p-6 scroll-mt-24">
      <h2 className="font-serif text-2xl">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}
function Row({ title, desc, children }: { title: string; desc?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3 border-b border-hairline last:border-b-0">
      <div className="min-w-0">
        <p className="text-sm font-medium">{title}</p>
        {desc && <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}
function UsageBar({ label, used, limit, unit = "" }: { label: string; used: number; limit: number; unit?: string }) {
  const pct = Math.min(100, (used / limit) * 100);
  return (
    <div>
      <div className="flex justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-mono tabular">{used}{unit} / {limit}{unit}</span>
      </div>
      <div className="mt-1 h-1.5 rounded-full bg-hairline overflow-hidden">
        <div className="h-full bg-accent" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
