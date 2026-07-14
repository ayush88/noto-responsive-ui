# NoTo — Build Plan (v2)

Premium marketing + product experience for an AI second-brain: capture audio, on-device Whisper transcription, chat over one session or the whole library. Quality bar: Linear / Superhuman / Vercel / Raycast.

Fully mocked front-end this pass — every state reachable, no backend wiring.

## Design language

**Away from violet.** Violet has become the default "AI startup" tell (Anthropic, dozens of GPT wrappers) and reads generic, not premium. Premium in 2026 = restraint, considered typography, near-monochrome with one confident accent that isn't the obvious choice.

Direction: **editorial + instrument**. Think a well-made notebook meets a hi-fi tape deck. Warm paper light theme, deep ink dark theme, and a single unexpected accent.

- **Palette**
  - Light: paper `#F7F5F0` bg, ink `#0E0E10` fg, warm muted `#6E6A62`, hairlines `#E4DFD5`.
  - Dark: obsidian `#0A0A0B` bg, elevated `#141416`, fg `#EDEBE6`, hairlines `#232326`.
  - **Accent**: warm signal orange `#E8541C` (a considered, ink-on-paper flag color — used sparingly for the record dot, primary CTA, active states, citation chips). Not a gradient, not a glow. One color, high intent.
  - Semantic: success `#1F7A4C`, warn `#9A6B00`, danger `#B8352A`.
- **Radii**: 6 / 10 / 14 — smaller than the current AI-app default, feels more considered.
- **Shadows**: hairline borders do most of the work. One soft elevation for popovers/dialogs. No colored glows.
- **Illustration**: monochrome linework, one accent stroke. Waveforms as crisp SVG.
- **Motion**: 140–200ms ease-out; record button has a subtle spring; transcript lines fade+rise as they stream; every state change animates (see Feedback rules). Respect `prefers-reduced-motion`.
- **No emojis** in UI chrome — Lucide only.

## Typography (the game-changer)

Fonts do the heavy lifting for premium feel. Three families, each doing one job well:

- **Display / hero / section titles**: **Fraunces** — a modern, softly quirky serif with optical sizing. Set with `font-optical-sizing: auto` and negative tracking (`-0.02em`) at large sizes. This is the "premium" note — a serif with character, not another Inter clone.
- **UI + body**: **Geist** — clean, geometric, tuned for interfaces (used by Vercel; sits perfectly next to a warm serif). `-0.01em` tracking on body, `0` on UI.
- **Numerals / timestamps / kbd**: **Geist Mono** — matches Geist's rhythm, keeps timecodes and shortcuts on-grid.

Type scale (rem, mobile → desktop clamped):
- Display 1: `clamp(3rem, 6vw, 5.5rem)`, Fraunces 400, tight leading `0.95`.
- Display 2: `clamp(2.25rem, 4vw, 3.5rem)`.
- H2: 1.75rem Fraunces 500.
- H3: 1.25rem Geist 600.
- Body: 1rem / 1.6 Geist 400.
- Small / meta: 0.8125rem Geist 500, muted.
- Mono: 0.8125rem Geist Mono, tabular-nums.

Global rules: `font-feature-settings: "ss01","cv11","tnum"`, tabular numerals on all durations/counters, headline drop-caps only on marketing hero.

All three loaded via `<link>` tags in `__root.tsx` head with `preconnect` — never `@import` remote URLs into `src/styles.css`.

## Themes

- CSS variables in `src/styles.css` under `:root` (light default) and `.dark`. Semantic tokens: `--background`, `--foreground`, `--muted`, `--muted-foreground`, `--border`, `--surface-1/2/3`, `--accent`, `--accent-foreground`, plus semantic status tokens.
- Theme provider reads `localStorage` post-mount (avoids hydration mismatch), falls back to `matchMedia('(prefers-color-scheme: dark)')`. Header toggle cycles Light → Dark → System, tooltip shows current mode. Toggling animates a subtle 200ms cross-fade of the root background.

## Feedback on every action (non-negotiable rule)

Every user action produces a visible, immediate response. No silent successes, no bare spinners.

Standard patterns used consistently:

- **Buttons**: press state (scale 0.98 + tone shift, 90ms), then either
  - a loading state (button disables, label swaps to inline spinner + verb — "Saving…", "Deleting…", "Sending…"), then
  - a success flash (accent underline sweep for 400ms) + toast (Sonner) with concrete text ("Session renamed", "Exported 3 sessions as .md", "Copied transcript").
- **Toasts** are always specific: subject + verb + result. Never "Success" alone. Include an Undo action for destructive/reversible ops (delete, move to bin, dismiss task). Undo runs for 6s.
- **Inline saves** (title, tags, summary edits): show a small "Saved" chip next to the field for 1.2s after commit, then fade.
- **Copy actions**: icon flips to check, tooltip becomes "Copied", toast fires.
- **Destructive actions**: AlertDialog confirm → button shows "Deleting…" → toast with Undo → row animates out (height collapse + fade, 180ms).
- **Bulk actions**: floating action bar shows "3 selected", action button transitions to "Exporting 3…" → toast "Exported 3 sessions".
- **Optimistic UI** for likes/checkbox toggles/tag adds — rollback on failure with an error toast that includes Retry.
- **Long ops** (import phases, diarization): phase bar advances with per-phase labels + elapsed time; no indeterminate spinner. On completion, section flashes accent underline once.
- **Form submits**: field-level inline validation on blur; submit button disables while pending; error banner appears above form with focus moved for screen readers.
- **Empty → filled transitions** animate (240ms fade+rise) so the user sees the state change.
- **⌘K palette** highlights matched item and closes with a soft scale-out.
- **Nothing changes silently.** If an action has no visible target change, a toast fires.

Reduced motion: swap animations for opacity-only transitions, keep toasts and disabled states — the feedback stays, the flourish drops.

## Global UX

- **AppShell** (all `/app/*` + session pages): sticky header with wordmark, primary nav (Library, Ask, Tasks, Record), center ⌘K "Search or ask…" pill (shows `⌘K` mono badge), theme toggle, avatar dropdown (Profile, Settings, Sign out).
- **Mobile bottom tab bar** (`< md`): Library / Ask / Record. Active tab: accent underline + filled icon + haptic-style scale bump.
- **⌘K command palette** (shadcn Command in Dialog): global search across sessions + tags, "Ask NoTo…" prompt, quick actions (New recording, Import audio, Toggle theme, Go to Settings, Sign out). Keyboard-first, arrow keys highlight, Enter runs, Esc closes.
- **PWA install banner**: bottom strip, dismissible, remembers in localStorage.
- **Destructive confirms**: AlertDialog for every delete/bulk-delete/clear-history/sign-out-all.
- **Icon-only buttons**: always `aria-label` + Tooltip.
- **States**: bespoke Loading (skeletons matching real layout), Empty (linework illustration + CTA + secondary link), Error (inline card + Retry + copy error id).

## Pages

1. **`/` Marketing landing** — public, no AppShell. Slim marketing header (wordmark, Product / Privacy / Pricing / Changelog, Sign in, "Get NoTo", theme toggle). Hero: Fraunces "Never forget anything." with an italic tail on "anything.", sub-copy on on-device Whisper + BYO LLM key, Google + Apple + email sign-in. Right: floating recorder mock with live waveform. Feature triptych (Capture / Transcribe / Recall). How-it-works 3 steps. Privacy strip: full-bleed muted band, lock glyph + "Audio never leaves your browser. Ever." Deep-feature grid (8 cells: Live captions, Speaker labels, Global RAG, Chrome extension, PWA, E2EE share, Action items, BYO key). FAQ accordion (8). Footer with wordmark, columns, "Made for people who take too many meetings."

2. **`/app` Library hub** — Greeting, "Upcoming events" calendar strip (mocked, click → prefills recorder with title), **Insights this week** AI card (3 stat tiles + one-paragraph summary + Regenerate). Search bar with segmented **Keyword / Semantic / Hybrid** toggle, tag filter chips, Active / Recycle-bin tabs. Session cards (1/2/3 col responsive) with title, relative time, duration, status chip, tag chips, preview line, hover reveals bulk-select checkbox. **Bulk action bar** floats in on selection (Tag, Export .md, Move to bin, Delete — each with pending states + toast). Page-wide drag-and-drop overlay opens Import. Rich empty state.

3. **`/app/record`** — Center: large SVG waveform, circular record button (idle → recording pulse → paused), timer with tabular numerals, live streaming transcript. Right rail: **Live Copilot** with contextual suggestion cards, Copy on each. Top: **Resume-after-crash banner**. Collapsible settings drawer: Whisper model tier (Tiny/Base/Small/Medium — speed-vs-accuracy meter), Language, Summary template (Meeting / Lecture / Interview / 1:1 / Custom), Custom vocabulary chips. **Mic-unavailable fallback** card with troubleshooting + Import CTA.

4. **`/app/sessions/[id]`** — Sticky sub-header: inline-editable title (blur → "Saved" chip + toast), meta row (date · duration · N segments · status), tag picker. **Summary card**: TL;DR + Key points + Action items (checkboxes), everything editable inline; menu with Regenerate / Restore / Change template — all with visible loading + success flash. **Ask this session** chat with citation chips (`[00:12:34]`) that scroll transcript + highlight the segment. **Speakers panel**: color chips, rename inline, "Run acoustic diarization" (phased progress). **Audio player** with custom scrubber synced to transcript highlighting, speed, skip 15s, keyboard shortcuts. **Transcript** with three view modes (Speaker / Polished / Timestamped) + ⌘K in-transcript find with match count. **Share panel**: link + expiry (1h/24h/7d/Never) + E2EE toggle (key fragment shown in preview) + Copy. **Visual moments** thumbnail row. Footer bar: Draft follow-up email, Copy, Download .md/.txt, Delete.

5. **`/app/ask`** — Global chat over the library. User/assistant bubbles, citations link to `/app/sessions/{id}#t=SECONDS`. Empty state: 4 example prompt cards. Sticky composer, Clear history (confirm + toast), active LLM badge.

6. **`/app/tasks`** — Action-items inbox grouped by session (collapsible). Each row: checkbox, task, due-date pill, citation chip, quick actions (→ Todoist / → Linear / Dismiss — each shows pending → toast with Undo). Filter: All / Open / Done / Dismissed. Bulk export.

7. **`/app/import`** — Drop-zone (dashed border, accent on drag-over), extension-handoff callout, **4-phase progress bar** (Create → Upload → Transcribe → Done) with per-phase labels + elapsed time + Cancel. Completed row flashes accent, then routes to the session with a toast "Imported <name>".

8. **`/app/settings`** — Desktop: sticky section rail + content pane; mobile: accordion. Sections: About you (textarea, autosave with "Saved" chip), LLM preference (radio cards: Auto / Gemini / Groq / OpenAI / Anthropic + BYO-key + Test connection button with pending → green tick / red X), Digest email (toggle + cadence + tag filter), Audio retention, Calendar integration, Todo integrations, Writing style, Phone numbers with OTP flow, Push notifications, Billing (plan card Free / Pro $20/mo + usage bars + invoice table), Speaker enrollment (10s recording per person with waveform preview + delete confirm), Download-my-library, Account / Sign out (confirm).

9. **`/s/[token]`** — Public read-only shared session, no AppShell. Minimal marketing header. Summary + Transcript read-only. **Ask this session** widget with rate-limit indicator ("3 questions left"). If URL has `#k=…`, full-width banner "This session is end-to-end encrypted. Only people with the link + key can read it." and Ask widget hidden.

10. **404 and 500** — on-brand, Fraunces headline, short copy, "Back to Library" / "Try again" buttons.

## Mock data

`src/lib/mock/*.ts`:
- 15 sessions: varied titles (1:1 with Priya, Q3 board prep, Customer interview — Acme, Design review, Lecture: distributed systems, etc.), tags, 4–68min durations, statuses, 2–5 speakers each, TL;DR + key points + action items, 30–80 transcript segments each, visual-moment thumbnails.
- 6 upcoming calendar events across today/this week.
- 24 action items across sessions.
- Weekly insights (hours, sessions, top tags).
- Invoice history, usage stats.
- All timestamps derived from `now` so relative times stay live.

Session detail lookups 404 through the route's `notFoundComponent`.

## Technical plan

- **Framework**: TanStack Start (scaffolded). Flat file routes under `src/routes/`: `index.tsx`, `app.tsx` (AppShell layout + `<Outlet />`), `app.index.tsx`, `app.record.tsx`, `app.sessions.$id.tsx`, `app.ask.tsx`, `app.tasks.tsx`, `app.import.tsx`, `app.settings.tsx`, `s.$token.tsx`. 404 via root `notFoundComponent`, 500 via root `errorComponent` (restyled).
- **Head metadata** per route: real title/description/og:title/og:description. Leaf routes get og:image only where meaningful (marketing landing gets a generated cover). Root gets defaults only.
- **Fonts** (Fraunces, Geist, Geist Mono) loaded via `<link>` in `__root.tsx` head with `preconnect`. Referenced via `@theme` `--font-*` tokens.
- **Styling**: Tailwind v4 tokens in `src/styles.css`. Add `--accent` (orange), `--accent-foreground`, `--surface-1/2/3`, semantic status tokens.
- **Components**: shadcn primitives (Dialog, AlertDialog, Command, Popover, Tabs, Accordion, Tooltip, DropdownMenu, Sheet, Progress, Checkbox, RadioGroup, Switch, Select, Slider). Custom: `Waveform`, `SessionCard`, `TranscriptView`, `SpeakerChip`, `CitationChip`, `AudioScrubber`, `PhaseProgress`, `CommandPalette`, `ThemeToggle`, `AppShell`, `MobileTabBar`, `MarketingHeader/Footer`, `EmptyState`, `ErrorState`, `SkeletonCard`, `SavedChip`, `PendingButton` (unified pending/success/error transitions).
- **Feedback plumbing**: single `PendingButton` component wraps loading/success/error/toast pattern so every CTA gets it for free. `useOptimistic` for checkbox/tag toggles. Sonner globally mounted with custom styling (paper bg, hairline border, mono meta line).
- **State**: URL for view-mode toggles / tabs / search mode; local for editing; mock data imported directly. Theme in a small context provider.
- **A11y**: single `<main>` per page; icon buttons `aria-label`; keyboard shortcuts (⌘K, R for record on `/app`, / focuses search, Esc closes palette/dialogs, J/K in transcript to move segments); `min-h-11 min-w-11` tap targets; both themes contrast-checked.
- **Responsive**: 360–1440+, header collapses at `md`, bottom tab bar `< md`, session detail right rail collapses to tabs on mobile.
- **Logo**: generate one accent-orange SVG monogram (rounded square + soundwave), import into header. Wordmark is Fraunces text — no image dependency.
- **Cover image**: one generated marketing hero-adjacent asset, used for `/` og:image.

## Out of scope (this pass)

Real Whisper WASM, real LLM calls, real auth, real sharing, real Todoist/Linear integrations. All flows use realistic mock data + simulated latency so every state — including every feedback state — is reachable and designable.

## Deliverable

All 10 pages routable. Both themes first-class. ⌘K palette + mobile bottom bar working. Every action visibly acknowledged. Fraunces + Geist + Geist Mono loaded and used deliberately. Signal-orange accent, no violet. Full mock data throughout.
