import { createFileRoute, Link } from "@tanstack/react-router";
import { Logo, Wordmark } from "@/components/brand/logo";
import { ThemeToggle } from "@/components/app/theme-toggle";
import { Waveform } from "@/components/app/waveform";
import {
  Mic,
  FileText,
  Sparkles,
  Lock,
  ScrollText,
  Users,
  Globe,
  Chrome,
  Smartphone,
  ShieldCheck,
  CheckSquare,
  KeyRound,
  ArrowRight,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NoTo — Never forget anything." },
      { name: "description", content: "AI second-brain that records, transcribes on-device with Whisper, and lets you chat over your whole memory library." },
      { property: "og:title", content: "NoTo — Never forget anything." },
      { property: "og:description", content: "On-device transcription. Bring your own LLM key. Your audio never leaves your browser." },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-dvh overflow-x-hidden bg-background text-foreground">
      <MarketingHeader />
      <Hero />
      <Triptych />
      <HowItWorks />
      <PrivacyStrip />
      <DeepFeatures />
      <FAQSection />
      <MarketingFooter />
    </div>
  );
}


function MarketingHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-hairline bg-background/85 backdrop-blur">
      <div className="mx-auto grid h-14 max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 md:px-6">
        <div className="flex items-center gap-4 min-w-0">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <Logo size={22} />
            <Wordmark />
          </Link>
          <nav className="ml-2 hidden md:flex items-center gap-5 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground">Product</a>
            <a href="#privacy" className="hover:text-foreground">Privacy</a>
            <a href="#pricing" className="hover:text-foreground">Pricing</a>
            <a href="#faq" className="hover:text-foreground">FAQ</a>
          </nav>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <ThemeToggle />
          <Link
            to="/app"
            className="hidden sm:inline-flex h-9 items-center rounded-md px-3 text-sm text-muted-foreground hover:text-foreground"
          >
            Sign in
          </Link>
          <Link
            to="/app"
            className="inline-flex h-9 items-center rounded-md bg-foreground px-3.5 text-sm font-semibold text-background hover:opacity-90"
          >
            Get NoTo
          </Link>
        </div>
      </div>
    </header>
  );
}


function Hero() {
  return (
    <section className="mx-auto max-w-6xl px-4 md:px-6 pt-12 md:pt-24 pb-16 md:pb-20">
      <div className="grid gap-10 md:gap-12 lg:grid-cols-[1.15fr_1fr] items-center">
        <div className="min-w-0">
          <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
            Your second brain, quietly
          </p>
          <h1 className="mt-5 text-[clamp(2.25rem,8vw,5rem)] font-semibold leading-[1.02] tracking-[-0.035em]">
            Never forget
            <br />
            <span className="italic font-medium">anything.</span>
          </h1>
          <p className="mt-6 max-w-lg text-base md:text-lg text-muted-foreground leading-relaxed">
            NoTo records your meetings, lectures and 1:1s, transcribes them on-device with Whisper, and lets you chat with your entire memory library. Bring your own LLM key. Your audio never leaves your browser.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3">
            <button className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-hairline bg-surface-1 px-4 text-sm font-medium hover:bg-surface-2 transition-colors">
              <GoogleGlyph /> Continue with Google
            </button>
            <button className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-hairline bg-surface-1 px-4 text-sm font-medium hover:bg-surface-2 transition-colors">
              <AppleGlyph /> Continue with Apple
            </button>
            <Link
              to="/app"
              className="inline-flex h-11 items-center justify-center gap-1 rounded-md px-3 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Continue with email <ArrowRight className="size-4" />
            </Link>
          </div>
          <p className="mt-5 text-xs text-muted-foreground">
            No credit card. Free for the first 5 hours of transcription.
          </p>
        </div>
        <HeroMock />
      </div>
    </section>
  );
}


function HeroMock() {
  return (
    <div className="relative min-w-0 w-full">
      <div className="absolute -inset-4 -z-10 rounded-3xl bg-surface-2/60 blur-2xl" aria-hidden />
      <div className="rounded-xl border border-hairline bg-card p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-accent animate-pulse-dot" />
            <span className="font-mono text-xs tabular text-muted-foreground">REC · 00:04:32</span>
          </div>
          <span className="rounded border border-hairline px-2 py-0.5 font-mono text-[10px] text-muted-foreground">Whisper · Small</span>
        </div>
        <div className="mt-4 rounded-md bg-surface-2 p-4">
          <Waveform seed="hero" bars={72} playing height={64} />
        </div>
        <div className="mt-4 space-y-3 text-sm">
          <div className="animate-rise-in">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="size-2 rounded-full bg-accent" />
              <span className="font-medium text-foreground">Priya</span>
              <span className="font-mono tabular">00:04:12</span>
            </div>
            <p className="mt-1 text-foreground/90">Let's target the fifteenth — that gives QA a full week to shake it out.</p>
          </div>
          <div className="animate-rise-in" style={{ animationDelay: "120ms" }}>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="size-2 rounded-full bg-foreground" />
              <span className="font-medium text-foreground">You</span>
              <span className="font-mono tabular">00:04:24</span>
            </div>
            <p className="mt-1 text-foreground/90">Agreed. I'll get the annual pricing proposal to Acme by Friday.</p>
          </div>
        </div>
        <div className="mt-5 flex items-center gap-2 border-t border-hairline pt-4 text-xs text-muted-foreground">
          <Lock className="size-3" aria-hidden />
          <span>Transcribing locally · nothing uploaded</span>
        </div>
      </div>
    </div>
  );
}

function GoogleGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.25 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"/>
    </svg>
  );
}
function AppleGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden fill="currentColor">
      <path d="M16.365 1.43c0 1.14-.42 2.22-1.26 3.06-.9.9-2.02 1.5-3.16 1.42-.13-1.12.42-2.28 1.24-3.09.9-.87 2.14-1.5 3.18-1.5v.11zM20 17.06c-.42.97-.9 1.87-1.51 2.7-.83 1.13-1.5 1.9-2.02 2.31-.79.6-1.63.9-2.53.92-.65 0-1.42-.19-2.32-.55-.9-.36-1.72-.55-2.47-.55-.79 0-1.63.19-2.55.55-.92.37-1.66.56-2.24.58-.87.04-1.74-.27-2.6-.94-.55-.44-1.25-1.24-2.09-2.4C.9 16.06.02 13.13.02 10.32c0-1.87.4-3.48 1.2-4.83.63-1.08 1.47-1.93 2.52-2.56 1.05-.62 2.18-.94 3.4-.96.7 0 1.6.22 2.72.65 1.12.43 1.84.65 2.16.65.24 0 1.04-.26 2.4-.77 1.29-.47 2.38-.67 3.28-.59 2.44.2 4.27 1.16 5.5 2.9-2.18 1.32-3.26 3.18-3.24 5.55.02 1.85.69 3.39 2.02 4.62.6.57 1.28 1.01 2.02 1.32-.16.47-.33.92-.52 1.36z"/>
    </svg>
  );
}

function Triptych() {
  const items = [
    { icon: Mic, title: "Capture", body: "One tap to record. Big waveform, live copilot suggestions, resume-after-crash — built for actually being in the meeting." },
    { icon: FileText, title: "Transcribe", body: "Whisper runs in your browser. Speaker labels, three view modes, and edits that stick. No servers, no waiting." },
    { icon: Sparkles, title: "Recall", body: "Ask NoTo across everything you've captured. Every answer cites the exact moment in the exact session." },
  ];
  return (
    <section id="features" className="mx-auto max-w-6xl px-4 md:px-6 py-16 md:py-24">
      <div className="grid gap-6 md:grid-cols-3">
        {items.map((it) => (
          <div key={it.title} className="rounded-lg border border-hairline bg-card p-6">
            <div className="inline-flex size-10 items-center justify-center rounded-md bg-surface-2">
              <it.icon className="size-5" aria-hidden />
            </div>
            <h3 className="mt-5 font-serif text-2xl">{it.title}</h3>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{it.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { n: "01", title: "Record or import", body: "Hit record before your meeting, or drop in an audio file. Chrome extension captures tabs in one click." },
    { n: "02", title: "Transcribed on-device", body: "Whisper turns speech into text in your browser. Speaker labels and summaries generated locally." },
    { n: "03", title: "Ask anything, anytime", body: "Chat over one session or your whole library. Citations link back to the exact second of audio." },
  ];
  return (
    <section className="border-y border-hairline bg-surface-1/60">
      <div className="mx-auto max-w-6xl px-4 md:px-6 py-16 md:py-24">
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">How it works</p>
        <h2 className="mt-3 font-serif text-3xl md:text-4xl max-w-xl">Three steps. No servers in between.</h2>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {steps.map((s, i) => (
            <div key={s.n} className="relative">
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-4 left-14 right-0 h-px bg-hairline" aria-hidden />
              )}
              <div className="font-mono text-xs text-accent">{s.n}</div>
              <h3 className="mt-2 font-serif text-xl">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PrivacyStrip() {
  return (
    <section id="privacy" className="bg-foreground text-background">
      <div className="mx-auto max-w-6xl px-4 md:px-6 py-14 flex flex-col md:flex-row md:items-center gap-6">
        <Lock className="size-8 text-accent shrink-0" aria-hidden />
        <div className="flex-1">
          <h2 className="font-serif text-2xl md:text-3xl">Audio never leaves your browser. Ever.</h2>
          <p className="mt-2 text-sm text-background/70 max-w-2xl">
            Transcription runs entirely on-device with Whisper. Your recordings, transcripts and summaries live locally by default. Cloud sync and sharing are opt-in, end-to-end encrypted, and always on your terms.
          </p>
        </div>
        <a href="#faq" className="text-sm underline underline-offset-4 text-background/80 hover:text-background shrink-0">
          Read the privacy details
        </a>
      </div>
    </section>
  );
}

function DeepFeatures() {
  const feats = [
    { icon: ScrollText, title: "Live captions", body: "See words as you speak, timestamped and cited." },
    { icon: Users, title: "Speaker labels", body: "Automatic diarization. Rename once, learned forever." },
    { icon: Globe, title: "Global RAG", body: "Ask across every session you've ever captured." },
    { icon: Chrome, title: "Chrome extension", body: "Capture any tab's audio with one click." },
    { icon: Smartphone, title: "PWA", body: "Install on iOS, Android or desktop. Works offline." },
    { icon: ShieldCheck, title: "E2EE share", body: "Share a session with a link + key — we can't read it." },
    { icon: CheckSquare, title: "Action items", body: "Auto-extracted. One tap to Todoist or Linear." },
    { icon: KeyRound, title: "Bring your own key", body: "Auto, Gemini, Groq, OpenAI, Anthropic. Your call." },
  ];
  return (
    <section id="pricing" className="mx-auto max-w-6xl px-4 md:px-6 py-16 md:py-24">
      <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">The rest of it</p>
      <h2 className="mt-3 font-serif text-3xl md:text-4xl max-w-xl">Everything a serious note-taker needs.</h2>
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-hairline rounded-lg overflow-hidden border border-hairline">
        {feats.map((f) => (
          <div key={f.title} className="bg-card p-6">
            <div className="grid grid-cols-[auto_1fr] gap-4">
              <f.icon className="size-5 text-accent mt-0.5" aria-hidden />
              <div className="min-w-0">
                <h3 className="text-sm font-semibold">{f.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{f.body}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-14 grid gap-6 md:grid-cols-2 rounded-lg border border-hairline p-8 bg-surface-1">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Pro</p>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="font-serif text-5xl">$20</span>
            <span className="text-muted-foreground text-sm">/month</span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">Unlimited hours. Bring your own LLM key. Everything you see here, forever.</p>
          <Link to="/app" className="mt-6 inline-flex h-11 items-center rounded-md bg-foreground px-4 text-sm font-medium text-background hover:opacity-90">
            Start free trial
          </Link>
        </div>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
          {["Unlimited transcription","On-device Whisper","Speaker diarization","Global RAG search","Chrome extension","E2EE sharing","Priority support","BYO LLM key"].map((x) => (
            <li key={x} className="flex items-center gap-2 text-muted-foreground">
              <CheckSquare className="size-4 text-accent" aria-hidden />
              <span className="text-foreground/90">{x}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function FAQSection() {
  const faqs = [
    { q: "Does my audio ever get uploaded?", a: "No. Transcription runs entirely in your browser using Whisper via WebAssembly. Recordings and transcripts stay local unless you explicitly enable sync or share a session." },
    { q: "Which LLM does NoTo use?", a: "Whichever one you choose. Auto picks the best model for the task, or you can pin Gemini, Groq, OpenAI or Anthropic. Bring your own API key — we never proxy your prompts." },
    { q: "How is sharing end-to-end encrypted?", a: "When you enable E2EE share, we generate a key that lives only in the URL fragment. The server stores the encrypted blob and never sees the key." },
    { q: "Can I export my data?", a: "Anytime, in one click. Download individual sessions as Markdown or plain text, or export your entire library as a zipped archive." },
    { q: "Does it work offline?", a: "Yes. Install the PWA, and recording plus transcription work fully offline. Ask NoTo requires an internet connection to reach your chosen LLM." },
    { q: "Which platforms are supported?", a: "Any modern browser on macOS, Windows, Linux, iOS and Android. Chrome extension is available for tab-audio capture." },
    { q: "How accurate is on-device Whisper?", a: "You choose the model tier — Tiny to Medium. Small is a sensible default: fast on a laptop, accuracy indistinguishable from server Whisper for most meetings." },
    { q: "What about longer audio files?", a: "Up to a few hours works comfortably in the browser. For longer or lower-power devices, drop the model tier to Tiny or Base." },
  ];
  return (
    <section id="faq" className="mx-auto max-w-3xl px-4 md:px-6 py-16 md:py-24">
      <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">FAQ</p>
      <h2 className="mt-3 font-serif text-3xl md:text-4xl">Questions we get a lot.</h2>
      <Accordion type="single" collapsible className="mt-8">
        {faqs.map((f, i) => (
          <AccordionItem key={i} value={`i${i}`} className="border-hairline">
            <AccordionTrigger className="text-left text-base">{f.q}</AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground leading-relaxed">{f.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}

function MarketingFooter() {
  return (
    <footer className="border-t border-hairline">
      <div className="mx-auto max-w-6xl px-4 md:px-6 py-12">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          <div>
            <Link to="/" className="flex items-center gap-2">
              <Logo size={22} />
              <Wordmark />
            </Link>
            <p className="mt-3 text-sm text-muted-foreground max-w-sm">
              Made for people who take too many meetings.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-10 text-sm">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground mb-3">Product</p>
              <ul className="space-y-1.5">
                <li><a href="#features" className="hover:text-foreground text-muted-foreground">Features</a></li>
                <li><a href="#pricing" className="hover:text-foreground text-muted-foreground">Pricing</a></li>
                <li><Link to="/app" className="hover:text-foreground text-muted-foreground">Changelog</Link></li>
              </ul>
            </div>
            <div>
              <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground mb-3">Company</p>
              <ul className="space-y-1.5">
                <li><a className="hover:text-foreground text-muted-foreground">About</a></li>
                <li><a className="hover:text-foreground text-muted-foreground">Contact</a></li>
              </ul>
            </div>
            <div>
              <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground mb-3">Legal</p>
              <ul className="space-y-1.5">
                <li><a className="hover:text-foreground text-muted-foreground">Privacy</a></li>
                <li><a className="hover:text-foreground text-muted-foreground">Terms</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-10 border-t border-hairline pt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-xs text-muted-foreground">
          <span>© 2026 NoTo Labs</span>
          <span className="font-mono">v1.0 · Made with care</span>
        </div>
      </div>
    </footer>
  );
}

// Prevent unused warning for Button
void Button;
