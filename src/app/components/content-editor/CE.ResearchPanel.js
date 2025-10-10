"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Settings,
  Loader2,
  CheckCircle2,
  Circle,
  TriangleAlert,
  ChevronDown,
  Search as SearchIcon,
  ListChecks,
  List,
  XCircle,
  Wand2,
  CircleHelp,
  ChevronRight,
  WandSparkles,
  Link as LinkIcon,
  HelpCircle,
  FlaskConical,
  ArrowUpRight,
  ArrowDownRight,
  ClipboardPaste,
  X,
  Plus,
  MoreHorizontal,
  Sparkles
} from "lucide-react";

/* ---------------------------------------------
   Small icon-only button with instant tooltip
---------------------------------------------- */
function IconHintButton({ onClick, label = "Paste to editor", size = 12, className = "" }) {
  return (
    <div className={`relative group ${className}`}>
      <button
        type="button"
        onClick={onClick}
        aria-label={label}
        className="grid place-items-center h-7 w-7 rounded-md border border-gray-200 bg-white/90 text-gray-600 shadow-sm hover:bg-gray-50 focus:outline-none"
      >
        <ClipboardPaste size={size} />
      </button>
      <span
        className="pointer-events-none absolute -top-7 right-0 rounded-md border border-gray-200 bg-white px-2 py-0.5
                   text-[10px] font-medium text-gray-700 shadow-sm opacity-0 group-hover:opacity-100
                   group-focus-within:opacity-100 transition-opacity duration-75 whitespace-nowrap"
      >
        {label}
      </span>
    </div>
  );
}

/* =========================================================
   Shared primitives (Pill, StepRow, Section, ResultItem)
========================================================= */

function Pill({ tone = "default", children }) {
  const map = {
    default: "bg-gray-100 text-gray-700 border-gray-200",
    good: "bg-emerald-50 text-emerald-700 border-emerald-200",
    warn: "bg-amber-50 text-amber-700 border-amber-200",
    info: "bg-blue-50 text-blue-700 border-blue-200",
    bad: "bg-rose-50 text-rose-700 border-rose-200",
  };
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium ${map[tone]}`}>
      {children}
    </span>
  );
}

/** status = "todo" | "active" | "done" */
function StepRow({ status, text }) {
  const isDone = status === "done";
  const isActive = status === "active";
  return (
    <div className={`flex items-start gap-2 text-[12px] rounded-md px-2 py-1.5 transition ${isActive ? "bg-blue-50/60" : ""}`}>
      {isDone ? (
        <CheckCircle2 size={15} className="text-emerald-600 mt-0.5 shrink-0" />
      ) : isActive ? (
        <Loader2 size={15} className="text-blue-600 mt-0.5 shrink-0 animate-spin" />
      ) : (
        <Circle size={15} className="text-gray-300 mt-0.5 shrink-0" />
      )}
      <span className="leading-5 text-[#4B5563]">{text}</span>
    </div>
  );
}

function Section({
  icon: Icon,
  title,
  statusTone = "default",
  statusText,
  defaultOpen = true,
  children,
}) {
  const [open, setOpen] = useState(defaultOpen);
  const toneMap = {
    good: "bg-emerald-50 text-emerald-700 border-emerald-200",
    bad: "bg-rose-50 text-rose-700 border-rose-200",
    warn: "bg-amber-50 text-amber-700 border-amber-200",
    default: "bg-gray-50 text-gray-700 border-gray-200",
  };

  return (
    <div className="rounded-xl border border-[#E5E7EB] bg-white shadow-sm">
      <button
        type="button"
        onClick={() => setOpen((s) => !s)}
        className="w-full flex items-center gap-3 px-4 py-2.5"
      >
        <span className="grid place-items-center h-7 w-7 rounded-full border border-[#E5E7EB] bg-white">
          <Icon size={16} className="text-gray-500" />
        </span>

        <div className="min-w-0 flex-1 text-left">
          <div className="text-[13px] font-semibold text-gray-800 truncate">
            {title}
          </div>
        </div>

        {statusText ? (
          <span className={`ml-auto text-[11px] px-2 py-0.5 border rounded-full font-medium ${toneMap[statusTone]}`}>
            {statusText}
          </span>
        ) : null}

        <ChevronDown
          size={16}
          className={`ml-2 text-gray-400 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && <div className="border-t border-gray-100 px-4 py-3">{children}</div>}
    </div>
  );
}

/** type = "success" | "warning" | "error" */
function ResultItem({ type = "success", children, onFix }) {
  const colorMap = {
    success: "text-emerald-600",
    warning: "text-amber-500",
    error: "text-rose-600",
  };
  const iconMap = {
    success: CheckCircle2,
    warning: TriangleAlert,
    error: XCircle,
  };
  const Icon = iconMap[type];

  return (
    <div className="flex items-start justify-between gap-3 py-1.5">
      <div className="flex items-start gap-2 text-[12px] text-[#4B5563] leading-5">
        <Icon size={15} className={`${colorMap[type]} mt-0.5 shrink-0`} />
        <span>{children}</span>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        {onFix && (
          <button
            type="button"
            className="inline-flex items-center gap-1 text-[11px] font-medium text-[#7E3AF2] hover:underline"
            onClick={onFix}
          >
            <Wand2 size={13} />
            Fix Now
          </button>
        )}
        <CircleHelp size={15} className="text-gray-300" />
      </div>
    </div>
  );
}

/* =========================================================
   ADVANCED: Optimize view (cards) + Drawer + Link Snippets
========================================================= */

function SegTab({ icon: Icon, active, children, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-[12px] font-medium ${
        active ? "bg-white border-amber-300 text-amber-700" : "bg-white/70 border-gray-200 text-gray-600 hover:bg-white"
      }`}
    >
      <Icon size={14} />
      {children}
    </button>
  );
}

function KPI({ label, value, delta, up }) {
  const Icon = up ? ArrowUpRight : ArrowDownRight;
  const tone = up ? "text-emerald-600" : "text-rose-600";
  return (
    <div className="flex-1 rounded-xl border border-gray-200 bg-white px-3 py-2">
      <div className="text-[10px] text-gray-500">{label}</div>
      <div className="mt-1 flex items-center gap-2">
        <div className="text-[16px] font-semibold text-gray-800">{value}</div>
        <span className={`inline-flex items-center gap-0.5 text-[10px] ${tone}`}>
          <Icon size={13} />
          {delta}
        </span>
      </div>
    </div>
  );
}

function FilterBar({ kw, onKw, tail, onTail, status, onStatus }) {
  return (
    <div className="mt-3 flex items-center gap-2">
      <div className="relative flex-1">
        <input
          value={kw}
          onChange={(e) => onKw(e.target.value)}
          placeholder="Filter by keywords"
          className="w-full h-9 rounded-lg border border-gray-200 bg-white px-8 text-[12px] outline-none focus:border-blue-300"
        />
        <SearchIcon size={13} className="absolute left-2.5 top-2.5 text-gray-400" />
      </div>
      <select
        value={tail}
        onChange={(e) => onTail(e.target.value)}
        className="h-9 rounded-lg border border-gray-200 bg-white px-2 text-[11px] text-gray-700"
      >
        <option>Long tail</option>
        <option>Short tail</option>
        <option>Exact</option>
      </select>
      <select
        value={status}
        onChange={(e) => onStatus(e.target.value)}
        className="h-9 rounded-lg border border-gray-200 bg-white px-2 text-[11px] text-gray-700"
      >
        <option>All Status</option>
        <option>Good</option>
        <option>Needs Fix</option>
      </select>
    </div>
  );
}

function ScoreCard({ title, badge, progress, source, tone = "green", onOpen, onPaste }) {
  const toneMap = {
    green: "bg-emerald-50 text-emerald-700 border-emerald-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
    gray: "bg-gray-100 text-gray-700 border-gray-200",
  };
  const barMap = {
    green: "bg-emerald-500",
    amber: "bg-amber-500",
    gray: "bg-gray-300",
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <button onClick={onOpen} className="w-full px-3.5 py-3 flex items-start gap-3">
        <span className={`text-[10px] px-2 py-0.5 border rounded-full font-semibold ${toneMap[tone]}`}>{badge}</span>
        <div className="min-w-0 flex-1 text-left">
          <div className="flex items-center gap-2">
            <div className="text-[13px] font-semibold text-gray-800">{title}</div>
            <span className="text-[10px] text-gray-500">Source: {source}</span>
          </div>
          <div className="mt-2 h-1.5 w-full rounded-full bg-gray-100">
            <div className={`h-1.5 rounded-full ${barMap[tone]}`} style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <IconHintButton
            onClick={(e) => {
              e.stopPropagation();
              onPaste?.();
            }}
          />
          <ChevronRight size={18} className="text-gray-400" />
        </div>
      </button>
    </div>
  );
}

function DrawerHeader({ title, onClose, countText }) {
  return (
    <div className="flex items-start justify-between">
      <div>
        <div className="text-[13px] font-semibold text-gray-800">{title}</div>
        {countText ? <div className="text-[11px] text-gray-500 mt-0.5">{countText}</div> : null}
      </div>
      <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
        <X size={16} />
      </button>
    </div>
  );
}

function StatTriplet({ mine, avg, results }) {
  return (
    <div className="mt-3 grid grid-cols-3 gap-2">
      <div className="rounded-xl border border-gray-200 bg-white px-3 py-2">
        <div className="text-[10px] text-gray-500">MY MENTION</div>
        <div className="text-[16px] font-semibold text-gray-800 mt-0.5">{mine}</div>
      </div>
      <div className="rounded-xl border border-gray-200 bg-white px-3 py-2">
        <div className="text-[10px] text-gray-500">AVG. MENTIONS</div>
        <div className="text-[16px] font-semibold text-gray-800 mt-0.5">{avg}</div>
      </div>
      <div className="rounded-xl border border-gray-200 bg-white px-3 py-2">
        <div className="text-[10px] text-gray-500">SEARCH RESULTS</div>
        <div className="text-[16px] font-semibold text-gray-800 mt-0.5">{results}</div>
      </div>
    </div>
  );
}

function SourceCard({ url, title, snippet }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`rounded-xl border ${open ? "border-amber-200 bg-amber-50" : "border-gray-200 bg-white"} shadow-sm`}>
      <button onClick={() => setOpen((s) => !s)} className="w-full px-3.5 py-3 text-left">
        <div className="text-[11px] text-gray-500 truncate">{url}</div>
        <div className="mt-1 flex items-center justify-between gap-2">
          <div className="text-[13px] font-medium text-gray-800 truncate">{title}</div>
          <ChevronRight size={16} className={`text-gray-400 transition-transform ${open ? "rotate-90" : ""}`} />
        </div>
      </button>
      {open && (
        <div className="px-3.5 pb-3 -mt-1 text-[12px] text-gray-600">
          <p className="leading-6">
            {snippet ?? (
              <>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do <span className="underline">eiusmod</span> tempor
                incididunt ut labore et dolore magna aliqua…
              </>
            )}
          </p>
        </div>
      )}
    </div>
  );
}

/* ===========================
   Research tab: UI atoms
=========================== */

function Chip({ children }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white px-2 py-0.5 text-[11px] text-gray-700">
      {children}
    </span>
  );
}

function HBadge({ level = "H1" }) {
  const color =
    level === "H1"
      ? "bg-amber-50 text-amber-700 border-amber-200"
      : level === "H2"
      ? "bg-violet-50 text-violet-700 border-violet-200"
      : "bg-emerald-50 text-emerald-700 border-emerald-200";
  return (
    <span className={`grid h-7 w-7 place-items-center rounded-md border text-[11px] font-semibold ${color}`}>
      {String(level).replace("H","")}
    </span>
  );
}

function RowIconButton({ children, title }) {
  return (
    <button
      type="button"
      title={title}
      className="grid h-7 w-7 place-items-center rounded-md border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
    >
      {children}
    </button>
  );
}

/* One heading row (Outline) */
function OutlineRow({ level="H2", title, onPaste, onAddInstruction }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white">
      <div className="flex items-center justify-between gap-3 px-3 py-2.5">
        {/* left */}
        <div className="flex min-w-0 items-center gap-3">
          <HBadge level={level} />
          <div className="min-w-0">
            <div className="truncate text-[13px] font-medium text-gray-800">
              {title}
            </div>
            <button
              type="button"
              onClick={onAddInstruction}
              className="mt-0.5 inline-flex items-center gap-1 text-[11px] text-gray-600 hover:underline"
            >
              + Add Instruction
            </button>
          </div>
        </div>

        {/* right actions (centered like your reference) */}
        <div className="flex items-center gap-2 shrink-0">
          <RowIconButton title="Paste to editor">
            <ClipboardPaste size={12} onClick={onPaste} />
          </RowIconButton>
          <RowIconButton title="More">
            <MoreHorizontal size={14} />
          </RowIconButton>
        </div>
      </div>
    </div>
  );
}


/* ---------------------------------------------
   Outline extraction from editor HTML
---------------------------------------------- */
function extractHeadingsFromHTML(html) {
  try {
    if (!html || typeof window === "undefined") return [];
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const tags = ["h1", "h2", "h3"];
    const out = [];
    tags.forEach(tag => {
      doc.querySelectorAll(tag).forEach(node => {
        const text = (node.textContent || "").trim();
        if (text) out.push({ level: tag.toUpperCase(), title: text });
      });
    });
    return out;
  } catch (e) {
    return [];
  }
}

/* =========================================================
   Main component with Basic + Advanced
========================================================= */

export default function CEResearchPanel({
  query = "",
  onQueryChange,
  onStart,
  seoMode = "basic", // "basic" | "advanced"
  metrics,
  onFix,
  onPasteToEditor, // optional handler you can wire to CE.Canvas
  editorContent = "",
}) {
  const [phase, setPhase] = useState("idle"); // basic phases: idle | searching | results
  const [advancedTab, setAdvancedTab] = useState("optimize"); // optimize | links | faqs | research
  const [drawerOpen, setDrawerOpen] = useState(false); // advanced drawer (e.g., Title Readability)

  // --- Research tab state & mock data ---
  const [researchTab, setResearchTab] = useState("outline"); // "outline" | "competitors" | "heatmaps"
  const [outline, setOutline] = useState([
    { level: "H1", title: "Content marketing strategies for SAAS." },
    { level: "H2", title: "Understanding SaaS Content Marketing" },
    { level: "H2", title: "Identifying Target Audiences" },
    { level: "H3", title: "Constructing Detailed Audience Personas" },
  ]);

  // if editorContent is passed in, sync headings
  useEffect(() => {
    const extracted = extractHeadingsFromHTML(editorContent);
    if (extracted.length) setOutline(extracted);
  }, [editorContent]);

  /* ----------------- BASIC: Phase logic ----------------- */
  const SEARCH_STEPS = [
    "Exploring effective content marketing strategies to enhance your brand’s reach and engagement.",
    "The Focus Keyword was used in the SEO Meta description.",
    "The Focus Keyword was used in the URL.",
    "The Focus Keyword appears in the first 10% of the content…..",
  ];
  const STEP_DELAY = 900;
  const END_PAUSE = 700;

  const [activeIndex, setActiveIndex] = useState(-1);
  const [doneMap, setDoneMap] = useState(Array(SEARCH_STEPS.length).fill(false));

  useEffect(() => {
    if (phase !== "searching") return;
    setActiveIndex(0);
    setDoneMap(Array(SEARCH_STEPS.length).fill(false));
    let cancelled = false;

    const run = (i) => {
      if (cancelled) return;
      setActiveIndex(i);
      const t = setTimeout(() => {
        if (cancelled) return;
        setDoneMap((prev) => {
          const next = [...prev];
          next[i] = true;
          return next;
        });
        if (i < SEARCH_STEPS.length - 1) run(i + 1);
        else {
          setTimeout(() => !cancelled && setPhase("results"), END_PAUSE);
          setActiveIndex(-1);
        }
      }, STEP_DELAY);
      return () => clearTimeout(t);
    };

    const cleanup = run(0);
    return () => {
      cancelled = true;
      if (typeof cleanup === "function") cleanup();
    };
  }, [phase]);

  const handleStart = () => {
    onStart?.(query);
    setPhase("searching");
  };

  /* ----------------- ADVANCED: State ----------------- */
  const [kwFilter, setKwFilter] = useState("");
  const [tailType, setTailType] = useState("Long tail");
  const [statusFilter, setStatusFilter] = useState("All Status");

  const cards = useMemo(
    () => [
      { title: "Content Marketing", badge: "4/3", progress: 92, source: 15, tone: "green", key: "content" },
      { title: "Strategies", badge: "2/4", progress: 58, source: 5, tone: "amber", key: "strategies" },
      { title: "Link Readability", badge: "1/3", progress: 35, source: 15, tone: "gray", key: "link" },
      { title: "Title Readability", badge: "3/3", progress: 90, source: 15, tone: "green", key: "title" },
    ],
    []
  );

  /* ----------------- LINKS TAB (Advanced) ----------------- */

  function BadgeScore({ score }) {
    const tone =
      score >= 15 ? "bg-amber-50 text-amber-700 border-amber-200" :
      score >= 10 ? "bg-gray-100 text-gray-700 border-gray-200" :
      "bg-emerald-50 text-emerald-700 border-emerald-200";
    return (
      <span className={`inline-flex h-7 min-w-[32px] items-center justify-center rounded-md border px-1 text-[12px] font-semibold ${tone}`}>
        {score}
      </span>
    );
  }

  function LinkRow({ rankScore, domain, sources, onPaste }) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white">
        <button className="w-full px-3 py-2 flex items-center justify-between gap-3">
          {/* Left */}
          <div className="flex min-w-0 items-center gap-3 text-left">
            <BadgeScore score={rankScore} />
            <div className="min-w-0">
              <div className="text-[13px] font-semibold text-gray-800 truncate">{domain}</div>
              <div className="text-[11px] text-gray-500">Source : {sources}</div>
            </div>
          </div>

          {/* Right actions (centered vertically, no overlap) */}
          <div className="flex items-center gap-2 shrink-0">
            <IconHintButton onClick={(e) => { e.stopPropagation(); onPaste?.(domain); }} />
            <ChevronRight size={18} className="text-gray-400" />
          </div>
        </button>
      </div>
    );
  }

  const [linkTab, setLinkTab] = useState("external"); // external | internal
  const linkRowsExternal = [
    { rankScore: 7,  domain: "Titlereadability.com",   sources: 15 },
    { rankScore: 16, domain: "Strategiesmaker.com",    sources: 5  },
    { rankScore: 13, domain: "Readabilityskills.gov.in", sources: 15 },
    { rankScore: 10, domain: "Titlebility.org",        sources: 9  },
  ];
  const linkRowsInternal = [
    { rankScore: 9,  domain: "yourdomain.com/blog/content-marketing", sources: 12 },
    { rankScore: 11, domain: "yourdomain.com/strategy/guide",         sources: 7  },
    { rankScore: 6,  domain: "yourdomain.com/resources/tools",        sources: 4  },
  ];

  /* ----------------- FAQ’S TAB (Advanced) ----------------- */

  function BrandDot({ label }) {
    return (
      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md border border-gray-200 bg-gray-50 text-[10px] font-semibold text-gray-700">
        {label.slice(0,1).toUpperCase()}
      </span>
    );
  }

  function FAQRow({ iconLabel, title, source, onPaste }) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white">
        <button className="w-full px-3 py-2 flex items-center justify-between gap-3">
          {/* Left */}
          <div className="flex min-w-0 items-center gap-3 text-left">
            <BrandDot label={iconLabel} />
            <div className="min-w-0">
              <div className="text-[13px] font-semibold text-gray-800 truncate">{title}</div>
              <div className="text-[11px] text-gray-500">Source : {source}</div>
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2 shrink-0">
            <IconHintButton onClick={(e) => { e.stopPropagation(); onPaste?.(title); }} />
            <ChevronRight size={18} className="text-gray-400" />
          </div>
        </button>
      </div>
    );
  }

  const [faqTab, setFaqTab] = useState("serp"); // serp | pa | quora | reddit
  const faqByTab = {
    serp: [
      { iconLabel: "N", title: "What is SaaS content marketing?", source: "itzfizz.com" },
      { iconLabel: "N", title: "Why is content marketing important …", source: "itzfizz.com" },
      { iconLabel: "N", title: "How does content marketing differ…", source: "itzfizz.com" },
      { iconLabel: "M", title: "How often should I publish content for…", source: "itzfizz.com" },
      { iconLabel: "D", title: "What metrics should I track to measure…", source: "itzfizz.com" },
    ],
    pa: [
      { iconLabel: "G", title: "People also ask: What are examples of content marketing?", source: "Google" },
      { iconLabel: "G", title: "People also ask: How do you start content marketing?", source: "Google" },
    ],
    quora: [
      { iconLabel: "Q", title: "What is the best way to get started with content marketing?", source: "Quora" },
      { iconLabel: "Q", title: "What are underrated content marketing strategies?", source: "Quora" },
    ],
    reddit: [
      { iconLabel: "R", title: "CMO: Content cadence that actually works in B2B?", source: "r/marketing" },
      { iconLabel: "R", title: "Is content marketing dead in 2025?", source: "r/SEO" },
    ],
  };

  /* ----------------- RENDER SWITCH ----------------- */
  if (seoMode !== "advanced") {
    // ---------- BASIC PANEL ----------
    if (phase === "idle") {
      return (
        <aside className="h-full rounded-r-[18px] border-l border-[var(--border)] bg-white/70 px-7 md:px-8 py-6 flex flex-col">
          <h3 className="text-[22px] font-semibold text-[var(--text-primary)] text-center">Research</h3>
          <p className="mt-3 mb-5 text-center text-[12px] leading-relaxed text-[var(--muted)]">
            Process the top 20 Google search results
            <br className="hidden sm:block" />
            for the following search query:
          </p>

          <div className="mx-auto w-full max-w-[420px]">
            <div className="relative">
              <input
                value={query}
                onChange={(e) => onQueryChange?.(e.target.value)}
                placeholder="Enter search query"
                className="w-full h-9 rounded-lg border border-[var(--border)] bg-[var(--bg-panel)] px-8 pr-10 text-sm outline-none focus:border-blue-300"
              />
              <SearchIcon size={14} className="absolute left-2 top-2.5 text-[var(--muted)]" />
              <button
                type="button"
                aria-label="Query settings"
                className="absolute right-1.5 top-1.5 grid h-6 w-6 place-items-center rounded-full border border-[var(--border)] bg-white text-[var(--muted)] hover:bg-[var(--input)]"
              >
                <Settings size={14} />
              </button>
            </div>

            <button
              onClick={handleStart}
              className="mt-5 mx-auto block rounded-full border border-blue-300 px-6 py-2 text-[12px] font-medium text-blue-600 hover:bg-blue-50"
            >
              Start
            </button>
          </div>
        </aside>
      );
    }

    if (phase === "searching") {
      return (
        <aside className="h-full rounded-r-[18px] border-l border-[var(--border)] bg-white/70 px-6 md:px-7 py-6">
          <div className="flex items-center gap-2 text-[13px] font-semibold text-[var(--text-primary)]">
            <Loader2 size={16} className="animate-spin text-blue-600" />
            Searching
            <Pill tone="info">Reference found</Pill>
          </div>

          <div className="mt-4 text-[12px] text-[var(--text-primary)] font-semibold">
            {query?.trim() || "Content marketing strategies"}
          </div>

          <div className="mt-3 space-y-2">
            {SEARCH_STEPS.map((text, i) => {
              const status = doneMap[i] ? "done" : i === activeIndex ? "active" : "todo";
              return <StepRow key={i} status={status} text={text} />;
            })}
          </div>
        </aside>
      );
    }

    // BASIC results
    return (
      <aside className="h-full rounded-r-[18px] border-l border-[var(--border)] bg-white/70 px-6 md:px-7 py-6 flex flex-col gap-3">
        <div className="mb-1 flex items-center gap-2 rounded-[10px] border border-amber-200 bg-amber-50 px-3 py-2">
          <TriangleAlert size={16} className="text-amber-700" />
          <div className="text-[12px] font-medium text-amber-800">Fix this</div>
          <div className="ml-auto text-[10px] text-amber-800/80">Once done, switch to ADVANCE for deep research</div>
        </div>

        <Section icon={ListChecks} title="Basic SEO" statusTone="good" statusText="All Good" defaultOpen>
          <div className="space-y-1.5">
            <ResultItem type="success">Hurray! You are using the Focus Keyword in SEO Title.</ResultItem>
            <ResultItem type="success">The Focus Keyword was used in the SEO Meta description.</ResultItem>
            <ResultItem type="success">The Focus Keyword was used in the URL.</ResultItem>
            <ResultItem type="success">The Focus Keyword appears in the first 10% of the content.</ResultItem>
          </div>
        </Section>

        <Section icon={TriangleAlert} title="Additional" statusTone="bad" statusText="4 Errors" defaultOpen>
          <div className="space-y-1.5">
            <ResultItem type="error" onFix={() => onFix?.("title-dup-keyword")}>
              The focus keyword appears twice in the title, which may look spammy. — <span className="font-medium">Revise to use it only once.</span>
            </ResultItem>
            <ResultItem type="error" onFix={() => onFix?.("meta-variation-missing")}>
              Missing Keyword Variation in Meta Description.
            </ResultItem>
            <ResultItem type="error" onFix={() => onFix?.("slug-shorten")}>
              Your URL includes unnecessary words: <span className="font-mono text-[12px]">/best-seo-tools-2025-for-digital-marketing-guide/</span>. Shorten it.
            </ResultItem>
            <ResultItem type="error" onFix={() => onFix?.("intro-intent")}>
              The first paragraph does not directly address the user’s search intent. Add a clear statement about how these tools improve rankings.
            </ResultItem>
          </div>
        </Section>

        <Section icon={List} title="Title Readability" statusTone="good" statusText="All Good" defaultOpen={false}>
          <div className="space-y-1.5">
            <ResultItem type="success">Your title is concise (under 60 characters).</ResultItem>
            <ResultItem type="success">It clearly states the benefit: “Best SEO Tools 2025 to Improve Google Rankings”.</ResultItem>
            <ResultItem type="success">Numbers and year add relevance.</ResultItem>
            <ResultItem type="success">Title is engaging and easy to scan.</ResultItem>
          </div>
        </Section>

        <Section icon={List} title="Content Readability" statusTone="good" statusText="All Good" defaultOpen={false}>
          <div className="space-y-1.5">
            <ResultItem type="success">Sentences are short and active.</ResultItem>
            <ResultItem type="success">Headings (H2, H3) break down the content logically.</ResultItem>
            <ResultItem type="success">Lists and tables are used for clarity.</ResultItem>
            <ResultItem type="success">Paragraphs average 2–3 sentences, making it skimmable.</ResultItem>
          </div>
        </Section>
      </aside>
    );
  }

  /* ---------- ADVANCED PANEL (Optimize / Links / FAQ’s / Research) ---------- */
  return (
    <aside className="h-full rounded-r-[18px] border-l border-[var(--border)] bg-white/70 px-5 md:px-6 py-5 flex flex-col gap-3">
      {/* Sub-tabs — keep them one row */}
      <div className="flex items-center gap-2 flex-nowrap">
        <SegTab icon={WandSparkles} active={advancedTab === "optimize"} onClick={() => setAdvancedTab("optimize")}>
          Optimize
        </SegTab>
        <SegTab icon={LinkIcon} active={advancedTab === "links"} onClick={() => setAdvancedTab("links")}>
          Links
        </SegTab>
        <SegTab icon={HelpCircle} active={advancedTab === "faqs"} onClick={() => setAdvancedTab("faqs")}>
          FAQ’s
        </SegTab>
        <SegTab icon={FlaskConical} active={advancedTab === "research"} onClick={() => setAdvancedTab("research")}>
          Research
        </SegTab>
      </div>

      {/* Optimize tab content (existing) */}
      {advancedTab === "optimize" && !drawerOpen && (
        <>
          {/* KPI row */}
          <div className="mt-2 grid grid-cols-3 gap-2">
            <KPI label="HEADINGS" value={2} delta={29} up={false} />
            <KPI label="LINKS" value={5} delta={1} up={false} />
            <KPI label="IMAGES" value={3} delta={1} up={true} />
          </div>

          {/* Filters */}
          <FilterBar
            kw={kwFilter}
            onKw={setKwFilter}
            tail={tailType}
            onTail={setTailType}
            status={statusFilter}
            onStatus={setStatusFilter}
          />

          {/* Cards */}
          <div className="mt-3 space-y-2">
            {cards.map((c) => (
              <ScoreCard
                key={c.key}
                title={c.title}
                badge={c.badge}
                progress={c.progress}
                source={c.source}
                tone={c.tone}
                onOpen={() => setDrawerOpen(c.key)}
                onPaste={() => onPasteToEditor?.(c.title)}
              />
            ))}
          </div>
        </>
      )}

      {/* Drawer: Title Readability expanded */}
      {advancedTab === "optimize" && drawerOpen && (
        <div className="mt-1 rounded-2xl border border-gray-200 bg-white p-3">
          <DrawerHeader
            title="Title Readability"
            countText="15 Search result mention this topic"
            onClose={() => setDrawerOpen(false)}
          />
          <StatTriplet mine={2} avg={5} results={3} />

          <div className="mt-3 space-y-2">
            <SourceCard
              url="https://www.greenleafinsights.com"
              title="How to start a blog in 10 steps: a beginner’s guide"
            />
            <SourceCard
              url="https://www.greenleafinsights.com"
              title="How to Launch a Blog in 10 Easy Steps"
            />
            <SourceCard url="https://www.greenleafinsights.com" title="Blogging Made Simple" />
            <SourceCard url="https://www.greenleafinsights.com" title="10 Steps to Starting a Blog" />
          </div>
        </div>
      )}

      {/* LINKS TAB */}
      {advancedTab === "links" && (
        <div className="mt-1 rounded-2xl border border-gray-200 bg-white p-3">
          {/* Top segmented tabs */}
          <div className="flex items-center gap-6 border-b border-gray-100 px-1">
            <button
              className={`px-2 pb-2 text-[12px] font-semibold ${linkTab === "external" ? "text-gray-900 border-b-2 border-gray-900" : "text-gray-500"}`}
              onClick={() => setLinkTab("external")}
            >
              External Link
            </button>
            <button
              className={`px-2 pb-2 text-[12px] font-semibold ${linkTab === "internal" ? "text-gray-900 border-b-2 border-gray-900" : "text-gray-500"}`}
              onClick={() => setLinkTab("internal")}
            >
              Internal link
            </button>
          </div>

          {/* Summary block */}
          <div className="mt-3 rounded-xl border border-gray-100 bg-gray-50 px-3 py-3">
            <div className="text-[24px] font-bold leading-6 text-gray-900">786</div>
            <div className="text-[11px] text-gray-600 -mt-0.5">Number of External Links</div>
            <div className="text-[11px] text-gray-500 mt-1">
              Top search results link to pages from <span className="font-medium">19 domains</span>
            </div>
          </div>

          {/* Filter input */}
          <div className="relative mt-3">
            <input
              className="w-full h-8 rounded-lg border border-gray-200 bg-white px-8 text-[12px] outline-none focus:border-blue-300"
              placeholder="Filter by keywords"
              value={kwFilter}
              onChange={(e) => setKwFilter(e.target.value)}
            />
            <SearchIcon size={13} className="absolute left-2.5 top-2 text-gray-400" />
          </div>

          {/* List */}
          <div className="mt-3 space-y-2">
            {(linkTab === "external" ? linkRowsExternal : linkRowsInternal)
              .filter((r) => r.domain.toLowerCase().includes(kwFilter.toLowerCase()))
              .map((r, idx) => (
                <LinkRow
                  key={idx}
                  rankScore={r.rankScore}
                  domain={r.domain}
                  sources={r.sources}
                  onPaste={(text) => onPasteToEditor?.(text)}
                />
              ))}
          </div>
        </div>
      )}

      {/* FAQ’S TAB */}
      {advancedTab === "faqs" && (
        <div className="mt-1 rounded-2xl border border-gray-200 bg-white p-3">
          {/* Sub tabs like SERP / People also ask / Quora / Reddit */}
          <div className="flex items-center gap-3 border-b border-gray-100 px-1">
            <button
              className={`px-2 pb-2 text-[12px] font-semibold ${faqTab === "serp" ? "text-gray-900 border-b-2 border-gray-900" : "text-gray-500"}`}
              onClick={() => setFaqTab("serp")}
            >
              SERP
            </button>
            <button
              className={`px-2 pb-2 text-[12px] font-semibold ${faqTab === "pa" ? "text-gray-900 border-b-2 border-gray-900" : "text-gray-500"}`}
              onClick={() => setFaqTab("pa")}
            >
              People also ask
            </button>
            <button
              className={`px-2 pb-2 text-[12px] font-semibold ${faqTab === "quora" ? "text-gray-900 border-b-2 border-gray-900" : "text-gray-500"}`}
              onClick={() => setFaqTab("quora")}
            >
              Quora
            </button>
            <button
              className={`px-2 pb-2 text-[12px] font-semibold ${faqTab === "reddit" ? "text-gray-900 border-b-2 border-gray-900" : "text-gray-500"}`}
              onClick={() => setFaqTab("reddit")}
            >
              Reddit
            </button>
          </div>

          {/* Filter input */}
          <div className="relative mt-3">
            <input
              className="w-full h-8 rounded-lg border border-gray-200 bg-white px-8 text-[12px] outline-none focus:border-blue-300"
              placeholder="Filter by keywords"
              value={kwFilter}
              onChange={(e) => setKwFilter(e.target.value)}
            />
            <SearchIcon size={13} className="absolute left-2.5 top-2 text-gray-400" />
          </div>

          {/* Results list */}
          <div className="mt-3 space-y-2">
            {faqByTab[faqTab]
              .filter((r) => r.title.toLowerCase().includes(kwFilter.toLowerCase()))
              .map((r, idx) => (
                <FAQRow
                  key={idx}
                  iconLabel={r.iconLabel}
                  title={r.title}
                  source={r.source}
                  onPaste={(text) => onPasteToEditor?.(text)}
                />
              ))}
          </div>
        </div>
      )}

      {/* RESEARCH TAB */}
      {advancedTab === "research" && (
        <div className="mt-1 rounded-2xl border border-gray-200 bg-white p-3">
          {/* top row: sub-tabs + quick actions */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-6 border-b border-gray-100 px-1">
              <button
                onClick={() => setResearchTab("outline")}
                className={`px-2 pb-2 text-[12px] font-semibold ${
                  researchTab === "outline" ? "text-gray-900 border-b-2 border-gray-900" : "text-gray-500"
                }`}
              >
                Outline
              </button>
              <button
                onClick={() => setResearchTab("competitors")}
                className={`px-2 pb-2 text-[12px] font-semibold ${
                  researchTab === "competitors" ? "text-gray-900 border-b-2 border-gray-900" : "text-gray-500"
                }`}
              >
                Competitor’s
              </button>
              <button
                onClick={() => setResearchTab("heatmaps")}
                className={`px-2 pb-2 text-[12px] font-semibold ${
                  researchTab === "heatmaps" ? "text-gray-900 border-b-2 border-gray-900" : "text-gray-500"
                }`}
              >
                Heatmap’s
              </button>
            </div>

            {/* right-side actions (Headings count + buttons) */}
            <div className="flex items-center gap-2">
              <Chip>28 Headings</Chip>
              <button
                type="button"
                className="inline-flex items-center gap-1 rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-[12px] font-medium text-gray-800 hover:bg-gray-50"
              >
                <Sparkles size={14} />
                AI Headings
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-1 rounded-md border border-amber-200 bg-amber-50 px-2.5 py-1.5 text-[12px] font-semibold text-amber-700 hover:bg-amber-50"
              >
                <Plus size={14} />
                Generate article
              </button>
            </div>
          </div>

          {/* Outline body */}
          {researchTab === "outline" && (
            <div className="mt-3 space-y-2">
              {outline.map((h, i) => (
                <OutlineRow
                  key={i}
                  level={h.level}
                  title={h.title}
                  onPaste={() => onPasteToEditor?.(h.title)}
                  onAddInstruction={() => onPasteToEditor?.(`Add instruction for: ${h.title}`)}
                />
              ))}
            </div>
          )}

          {researchTab === "competitors" && (
            <div className="mt-4 grid place-items-center rounded-xl border border-dashed border-gray-200 py-10 text-gray-500 text-[12px]">
              Competitor mapping view (domains, gaps, overlap) — wire data here.
            </div>
          )}

          {researchTab === "heatmaps" && (
            <div className="mt-4 grid place-items-center rounded-xl border border-dashed border-gray-200 py-10 text-gray-500 text-[12px]">
              Heatmap of headings vs. SERP frequency — wire data here.
            </div>
          )}
        </div>
      )}

    </aside>
  );
}
