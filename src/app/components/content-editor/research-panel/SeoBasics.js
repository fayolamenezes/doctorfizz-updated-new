"use client";

import React, { useEffect, useState } from "react";
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
} from "lucide-react";

/* --- Inline atoms copied from your original file --- */
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

function Section({ icon: Icon, title, statusTone = "default", statusText, defaultOpen = true, children }) {
  const [open, setOpen] = useState(defaultOpen);
  const toneMap = {
    good: "bg-emerald-50 text-emerald-700 border-emerald-200",
    bad: "bg-rose-50 text-rose-700 border-rose-200",
    warn: "bg-amber-50 text-amber-700 border-amber-200",
    default: "bg-gray-50 text-gray-700 border-gray-200",
  };

  return (
    <div className="rounded-xl border border-[#E5E7EB] bg-white shadow-sm">
      <button type="button" onClick={() => setOpen((s) => !s)} className="w-full flex items-center gap-3 px-4 py-2.5">
        <span className="grid place-items-center h-7 w-7 rounded-full border border-[#E5E7EB] bg-white">
          <Icon size={16} className="text-gray-500" />
        </span>
        <div className="min-w-0 flex-1 text-left">
          <div className="text-[13px] font-semibold text-gray-800 truncate">{title}</div>
        </div>
        {statusText ? (
          <span className={`ml-auto text-[11px] px-2 py-0.5 border rounded-full font-medium ${toneMap[statusTone]}`}>{statusText}</span>
        ) : null}
        <ChevronDown size={16} className={`ml-2 text-gray-400 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="border-t border-gray-100 px-4 py-3">{children}</div>}
    </div>
  );
}

function ResultItem({ type = "success", children, onFix }) {
  const colorMap = { success: "text-emerald-600", warning: "text-amber-500", error: "text-rose-600" };
  const iconMap = { success: CheckCircle2, warning: TriangleAlert, error: XCircle };
  const Icon = iconMap[type];

  return (
    <div className="flex items-start justify-between gap-3 py-1.5">
      <div className="flex items-start gap-2 text-[12px] text-[#4B5563] leading-5">
        <Icon size={15} className={`${colorMap[type]} mt-0.5 shrink-0`} />
        <span>{children}</span>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        {onFix && (
          <button type="button" className="inline-flex items-center gap-1 text-[11px] font-medium text-[#7E3AF2] hover:underline" onClick={onFix}>
            <Wand2 size={13} />
            Fix Now
          </button>
        )}
        <CircleHelp size={15} className="text-gray-300" />
      </div>
    </div>
  );
}
/* --- end atoms --- */

export default function SeoBasics({ query, onQueryChange, onStart, onFix, onPasteToEditor, phase, setPhase }) {
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
          <ResultItem type="error" onFix={() => onPasteToEditor?.("Add a clear statement about how these tools improve rankings.")}>
            The first paragraph does not directly address the user’s search intent.
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