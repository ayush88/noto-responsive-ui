
# NoTo — Refinement Pass

Addressing every point you raised. Scoped to presentation/UX; no backend or data changes.

## 1. Typography — full rethink

Drop the multi-family editorial system (Fraunces + Geist + Geist Mono felt scattered and a bit retro). Move to **one ultra-modern neo-grotesque** across the whole product, with a mono only where it earns its place (timestamps/kbd).

- **UI + display**: **Inter Variable** (via `@fontsource-variable/inter`) — the modern standard for interfaces (Linear, Vercel dashboards, Arc). Uses variable weight axis so headings can be 600–700 and body a **confident 460–470** instead of the current thin 400. Applied features: `"cv11" "ss01" "ss03" "tnum"` for a cleaner `a`, single-story `g`, straighter numerals.
- **Numerics/kbd**: **JetBrains Mono Variable** only inside `<kbd>`, timers, and duration chips — nowhere else. No third face.
- **No serif anywhere.** Remove Fraunces + Geist + Geist Mono links from `__root.tsx`, remove `--font-serif`.
- Body text weight bumped from 400 → **470** (Inter's variable axis handles this without a second file). Headings 640–700, tracking `-0.02em` at display sizes only, `0` on body. Line-height 1.55 body, 1.1 display.
- Self-hosted via `@fontsource-variable/*` packages (no Google Fonts `<link>`, faster + no CLS + respects the Tailwind v4 remote-import rule).

Result: one voice, extremely readable, unmistakably modern — the "premium-through-restraint" bar you asked for.

## 2. CTA icon/text alignment

Root cause: mixed use of raw `<button>` + `inline-flex` on some CTAs and `gap-2` on the outer button while icons sit at their default `vertical-align` — icons drift 1–2px off the text baseline, especially in `PendingButton` where the label is wrapped in an extra `<span>`.

Fix globally:
- Standardize every button as `inline-flex items-center justify-center gap-2 leading-none`.
- Icons: fixed `size-4 shrink-0` with `translate-y-[0.5px]` optical nudge on lucide strokes (they render slightly high).
- `PendingButton`: flatten the nested spans, put the icon and label as direct flex children so `items-center` actually aligns them.
- Audit landing hero CTAs, session card status chips, tag chips, `Insights` regenerate button, share/copy buttons — same rule.

## 3. Homepage mobile responsiveness

Landing page currently assumes desktop widths. Fixes:
- Hero: two-column grid → single column below `md`, recorder mock moves under the copy, not beside it.
- Feature triptych: `grid-cols-3` → `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`.
- Deep-feature 8-cell grid: `grid-cols-4` → `grid-cols-2 lg:grid-cols-4`, tighter padding.
- Marketing header: nav collapses to a Sheet menu below `md`; only wordmark + "Get NoTo" stay visible.
- Every header row using flex+wrap gets the `grid-cols-[minmax(0,1fr)_auto]` + `min-w-0` + `shrink-0` + `truncate` pattern (see responsive-layout-patterns).
- Hero display size: `clamp(2.25rem, 8vw, 5.5rem)` so it doesn't overflow at 360px.
- Test breakpoints: 360, 390, 768, 1024, 1440.

## 4. Mobile bottom bar — Record as floating action

Redesign the 3-tab bar so **Record** is the anchor:

```text
┌──────────────────────────────────────┐
│   Library          Ask               │
│                                      │
│            ┌────────┐                │
│            │   ◉    │  ← FAB, -18px  │
│            └────────┘     offset,    │
│                           accent bg  │
└──────────────────────────────────────┘
```

- Two flat tabs (Library, Ask) share the bottom bar.
- Center **Record FAB**: circular 56px, accent-orange fill, white record dot, elevated (`shadow-lg`, hairline ring), floats above the bar with a `-translate-y-4` offset. Persistent on every `/app/*` page.
- Tap → `/app/record` and auto-starts a new recording (existing route already supports this).
- Long-press (or right-click on desktop preview) → quick-import sheet.
- Recording in progress? FAB pulses accent + shows live timer under it in mono. Tap returns to the active session.
- Respects `prefers-reduced-motion` (no pulse, just solid accent).

## 5. `/app` "Insights this week" — text overlap

The stat tiles use fixed heights + absolute-positioned value labels; on narrower cards the paragraph summary wraps and clips the tiles below. Rebuild as a normal flex/grid card:
- 3 tiles on `sm+`, stack on mobile.
- Each tile: label (small, muted) on top, value (display size, tabular-nums) below, no absolute positioning.
- Summary paragraph sits in its own row with `mt-6`, not overlapping.
- Regenerate button aligns right, uses the fixed `PendingButton`.

## 6. `/app/sessions/[id]` playback speed button overflowing

Audio player toolbar is a single `flex` row with no overflow handling; on the sessions detail right rail the speed control (`1.0x` menu) pushes past the card. Fixes:
- Player row: `grid-cols-[auto_1fr_auto]` (transport | scrubber | meta) with `min-w-0` on the scrubber.
- Speed control moves into a compact `DropdownMenu` triggered by a `1.0×` chip button (mono, tabular), 32px wide, sits inside the meta cluster with skip-15s and download.
- On < `md`, meta cluster collapses to a "…" menu.
- Scrubber gets `min-w-0` so it can actually shrink.

## 7. Transcript tabs — merge Speaker + Timestamped, drop Polished

- Remove **Polished** tab entirely (it was a diff-only cosmetic view, not pulling weight).
- Merge **Speaker** and **Timestamped** into a single default view: each segment shows speaker chip + timestamp + text on one line, timestamp in mono, click-to-seek.
- Replace the tab strip with a single **Density** toggle (Comfortable / Compact) — same info, less chrome.
- ⌘K in-transcript find and J/K navigation stay.

## Files touched

- `src/routes/__root.tsx` — swap font `<link>`s for `@fontsource-variable/*` imports, update `<title>` unchanged.
- `src/styles.css` — replace `--font-serif`/`--font-sans`/`--font-mono` tokens; bump base font-weight; remove Fraunces references; keep warm paper palette untouched.
- `src/components/app/pending-button.tsx` — flatten spans, fix icon alignment, standardize `leading-none` + `items-center`.
- `src/components/app/app-shell.tsx` — remove Fraunces classnames on wordmark, tighten header responsive rules, redesign `MobileTabBar` with center Record FAB (moved inline or into its own component).
- `src/components/brand/logo.tsx` — wordmark now Inter 700 tight-tracked (no serif).
- `src/routes/index.tsx` — full responsive audit of landing (hero, triptych, 8-cell grid, marketing header → Sheet on mobile).
- `src/routes/app.index.tsx` — rebuild Insights card layout so text/tiles don't overlap.
- `src/routes/app.sessions.$id.tsx` — audio player grid rebuild, speed dropdown, transcript tab merge, drop Polished.
- Delete unused Fraunces/Geist-related classes across all pages (find-and-replace `font-serif` → default).
- `package.json` — add `@fontsource-variable/inter` and `@fontsource-variable/jetbrains-mono`.

## Out of scope

Palette (staying warm paper + signal-orange), routing structure, mock data, all other pages' content.

Approve and I'll implement in one pass, then screenshot 360/768/1440 in both themes to verify.
