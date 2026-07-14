// Realistic mock data for the NoTo app.

export type Speaker = { id: string; name: string; color: string };
export type Segment = { id: string; speakerId: string; start: number; end: number; text: string };
export type ActionItem = { id: string; text: string; done: boolean; sessionId: string; dueDays?: number; dismissed?: boolean };
export type Session = {
  id: string;
  title: string;
  createdAt: Date;
  durationSec: number;
  status: "transcribed" | "processing" | "failed";
  tags: string[];
  speakers: Speaker[];
  tldr: string;
  keyPoints: string[];
  actionItems: ActionItem[];
  segments: Segment[];
  binned?: boolean;
  visualMoments?: number; // count of visual thumbnails
};

const now = new Date();
const daysAgo = (d: number, h = 0) => new Date(now.getTime() - d * 86400_000 - h * 3600_000);

const speakerPool: Speaker[] = [
  { id: "s1", name: "You", color: "#0E0E10" },
  { id: "s2", name: "Priya Shah", color: "#E8541C" },
  { id: "s3", name: "Marcus Bell", color: "#1F7A4C" },
  { id: "s4", name: "Ana Ferreira", color: "#9A6B00" },
  { id: "s5", name: "Jonas Weber", color: "#3A6EA5" },
  { id: "s6", name: "Rina Ito", color: "#8E44AD" },
];

const pick = <T,>(arr: T[], n: number) => arr.slice(0, n);

function makeSegments(speakers: Speaker[], count: number, sessionId: string): Segment[] {
  const lines = [
    "So the main thing I want to flag is that our onboarding drop-off is still at forty-two percent.",
    "Right, and we saw the same pattern last quarter — it correlates with the second-day email.",
    "I think we should ship the redesigned welcome flow before the marketing push.",
    "Agreed. Can we set a firm date? Otherwise it slips again.",
    "Let's target the fifteenth. That gives QA a full week.",
    "One more thing — the customer from Acme raised the pricing question again.",
    "They want annual, not monthly. I told them we'd have an answer by Friday.",
    "Okay. I'll draft the annual plan proposal and share it in the doc.",
    "Perfect. Any blockers on the API side?",
    "The rate-limit refactor is done. Deploying to staging tonight.",
    "Great. Let's also talk about the hiring plan for Q4.",
    "We have two open roles — senior designer and platform engineer.",
    "I've got three designer candidates in the pipeline. Two are strong.",
    "Let's move them to on-site next week if possible.",
    "Sounds good. Anything else before we wrap?",
    "Just a reminder: the board deck needs a first draft by Wednesday.",
    "Right. I'll circulate it Tuesday evening for review.",
    "Thanks everyone. Talk soon.",
  ];
  const out: Segment[] = [];
  let t = 0;
  for (let i = 0; i < count; i++) {
    const speaker = speakers[i % speakers.length];
    const text = lines[i % lines.length];
    const dur = 4 + Math.round(Math.random() * 8);
    out.push({ id: `${sessionId}-seg-${i}`, speakerId: speaker.id, start: t, end: t + dur, text });
    t += dur;
  }
  return out;
}

function s(
  id: string,
  title: string,
  daysAgoN: number,
  durMin: number,
  tags: string[],
  speakerCount: number,
  tldr: string,
  keyPoints: string[],
  actionItems: string[],
  status: Session["status"] = "transcribed",
  visualMoments = 0,
): Session {
  const speakers = pick(speakerPool, speakerCount);
  const durationSec = durMin * 60;
  const segCount = Math.max(20, Math.min(80, Math.round(durMin * 1.5)));
  const segs = makeSegments(speakers, segCount, id);
  return {
    id,
    title,
    createdAt: daysAgo(daysAgoN, Math.random() * 8),
    durationSec,
    status,
    tags,
    speakers,
    tldr,
    keyPoints,
    actionItems: actionItems.map((text, i) => ({
      id: `${id}-a-${i}`,
      text,
      done: Math.random() < 0.25,
      sessionId: id,
      dueDays: [3, 5, 7, 14][i % 4],
    })),
    segments: segs,
    visualMoments,
  };
}

export const sessions: Session[] = [
  s("q3-board", "Q3 board prep", 0, 47, ["Leadership", "Strategy"], 3,
    "Board deck needs a first draft by Wednesday. Team aligned on annual pricing pilot and onboarding redesign timeline.",
    ["Annual pricing proposal by Friday", "Onboarding redesign ships on the 15th", "Board deck first draft Wednesday", "Two designer candidates moving to on-site"],
    ["Draft board deck outline", "Send annual plan proposal to Acme", "Schedule on-sites for designer candidates", "Ship onboarding welcome flow"],
    "transcribed", 4),
  s("priya-11", "1:1 with Priya", 0, 22, ["1:1", "People"], 2,
    "Priya wants to lead the platform migration. Career growth conversation — targeting staff engineer path by next review.",
    ["Priya volunteering for platform migration lead", "Staff engineer path by next review", "Wants more mentorship time"],
    ["Introduce Priya to the migration working group", "Set up biweekly mentor sync"]),
  s("acme-interview", "Customer interview — Acme", 1, 38, ["Research", "Sales"], 2,
    "Acme wants annual billing and SSO. Willing to expand to 200 seats if annual lands by Q1.",
    ["Annual billing is a blocker", "SSO required for expansion", "Would refer two peers"],
    ["Send annual plan proposal", "Add SSO to roadmap draft", "Ask for two intro emails"], "transcribed", 3),
  s("design-review", "Design review — Library redesign", 1, 34, ["Design"], 3,
    "New library layout tested well with all five participants. Search-mode toggle needs clearer labeling.",
    ["Cards preferred over table by 4/5", "Semantic mode confused two participants", "Bulk actions discoverable"],
    ["Rename 'Semantic' toggle option", "Ship v2 next Tuesday"]),
  s("distributed-lecture", "Lecture: distributed systems", 2, 68, ["Learning"], 1,
    "CAP theorem revisited with real-world Cassandra examples. Vector clocks and CRDTs covered in depth.",
    ["CAP is a tradeoff, not a checklist", "Vector clocks solve causality", "CRDTs merge without coordination"],
    ["Read the Dynamo paper", "Try implementing a G-Counter"]),
  s("marcus-11", "1:1 with Marcus", 2, 18, ["1:1", "People"], 2,
    "Marcus flagged burnout risk on the platform team. Wants to redistribute on-call rotation.",
    ["On-call rotation feels heavy", "Considering a sabbatical in Q1", "Wants a second senior on platform"],
    ["Rework on-call rotation", "Discuss sabbatical policy with HR"]),
  s("marketing-sync", "Marketing weekly", 3, 29, ["Marketing"], 4,
    "Launch date confirmed for the 15th. Landing page copy nearly final. Blog post scheduled.",
    ["Launch on the 15th", "Landing page in review", "Blog post going live launch day", "Podcast tour queued"],
    ["Finalize landing page copy", "Approve blog draft", "Book two more podcasts"], "transcribed", 2),
  s("hiring-loop", "Hiring loop debrief — Ana", 3, 41, ["Hiring"], 4,
    "Strong hire signal from three of four interviewers. One concern about system design depth.",
    ["3 strong hires, 1 mixed", "System design was the weak signal", "Great culture fit"],
    ["Schedule follow-up system design chat", "Prepare offer terms"]),
  s("customer-jonas", "Customer call — Jonas", 4, 26, ["Sales", "Research"], 2,
    "Jonas's team of 30 wants to trial pro. Concerned about data residency in EU.",
    ["30-seat trial requested", "EU data residency required", "Migration from Otter"],
    ["Send trial link", "Confirm EU region roadmap"]),
  s("engineering-planning", "Engineering planning — Q4", 5, 54, ["Planning", "Engineering"], 5,
    "Q4 priorities: SSO, mobile app v2, and the search re-index. Three engineers on each track.",
    ["SSO is P0", "Mobile v2 targets December", "Search re-index runs in background"],
    ["Confirm SSO scope with security", "Kick off mobile v2 sprint", "Prep search re-index runbook"], "transcribed", 5),
  s("investor-update", "Investor update prep", 6, 31, ["Fundraising"], 2,
    "MRR up 18% MoM. Two new logos this month. Runway extended to 22 months.",
    ["MRR up 18%", "22 months runway", "Two new logos"],
    ["Send monthly update Friday", "Draft next round pitch"]),
  s("rina-11", "1:1 with Rina", 7, 24, ["1:1", "People"], 2,
    "Rina wrapping up the mobile prototype. Wants to pair with iOS specialist next sprint.",
    ["Mobile prototype 80% done", "Needs iOS pairing", "Interested in leading design system"],
    ["Match Rina with an iOS contractor", "Discuss design system lead role"]),
  s("legal-review", "Legal review — DPA updates", 8, 44, ["Legal"], 3,
    "New DPA terms drafted. Two clauses need customer sign-off before rollout.",
    ["Two clauses need customer signoff", "Rollout blocked on top 5 customers", "Aim for end of month"],
    ["Send DPA update to top 5 customers", "Track signoff progress"], "processing"),
  s("failed-session", "Team all-hands (audio dropped)", 9, 6, ["Team"], 3,
    "", [], [], "failed"),
  s("interview-podcast", "Podcast interview — Design Details", 10, 62, ["PR"], 2,
    "Talked through NoTo's origin, on-device transcription bet, and BYO-key philosophy.",
    ["On-device is the moat", "BYO key = trust", "Origin story lands well"],
    ["Send follow-up notes", "Share episode link when live"], "transcribed", 6),
];

export const calendarEvents = [
  { id: "e1", title: "1:1 with Priya", time: "Today · 2:00 PM", duration: 30 },
  { id: "e2", title: "Design critique", time: "Today · 4:00 PM", duration: 45 },
  { id: "e3", title: "Customer interview — Northwind", time: "Tomorrow · 10:30 AM", duration: 45 },
  { id: "e4", title: "Q4 planning workshop", time: "Wed · 1:00 PM", duration: 90 },
  { id: "e5", title: "Board prep — dry run", time: "Thu · 9:00 AM", duration: 60 },
  { id: "e6", title: "Podcast — Product Hunt", time: "Fri · 3:00 PM", duration: 60 },
];

export const insights = {
  hoursCaptured: 9.3,
  sessionsCount: 12,
  topTags: ["1:1", "Research", "Design"],
  summary:
    "You captured 9.3 hours across 12 sessions this week — up 22% from last week. Most of your time went to 1:1s and customer research. Three action items from last week are still open.",
};

export const invoices = [
  { id: "INV-1042", date: "Jul 1, 2026", amount: "$20.00", status: "Paid" },
  { id: "INV-1029", date: "Jun 1, 2026", amount: "$20.00", status: "Paid" },
  { id: "INV-1015", date: "May 1, 2026", amount: "$20.00", status: "Paid" },
  { id: "INV-1001", date: "Apr 1, 2026", amount: "$20.00", status: "Paid" },
];

export const usage = {
  hoursUsed: 41.2,
  hoursLimit: 100,
  sessionsUsed: 78,
  sessionsLimit: 500,
};

export function findSession(id: string) {
  return sessions.find((s) => s.id === id);
}

export const allActionItems: ActionItem[] = sessions.flatMap((s) => s.actionItems);

export const allTags = Array.from(new Set(sessions.flatMap((s) => s.tags))).sort();
