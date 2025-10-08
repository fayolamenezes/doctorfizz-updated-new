"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Settings, Loader2, CheckCircle2, Circle, TriangleAlert,
  ChevronDown, ChevronRight, Search, ListChecks, List
} from "lucide-react";

/* ---------- tiny UI helpers ---------- */
function Chip({ tone = "default", children }) {
  const map = {
    default: "bg-gray-100 text-gray-700 border-gray-200",
    good: "bg-emerald-50 text-emerald-700 border-emerald-200",
    warn: "bg-amber-50 text-amber-800 border-amber-200",
    info: "bg-blue-50 text-blue-700 border-blue-200",
  };
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium ${map[tone]}`}>
      {children}
    </span>
  );
}

/** status: "todo" | "active" | "done" */
function Row({ status, text }) {
  const isDone = status === "done";
  const isActive = status === "active";
  const isTodo = status === "todo";

  return (
    <div
      className={`flex items-start gap-2 text-[13px] rounded-md px-2 py-1.5 transition
      ${isActive ? "bg-blue-50/50" : ""}`}
    >
      {isDone ? (
        <CheckCircle2 size={16} className="text-emerald-600 mt-0.5 shrink-0" />
      ) : isActive ? (
        <Loader2 size={16} className="text-blue-600 mt-0.5 shrink-0 animate-spin" />
      ) : (
        <Circle size={16} className="text-gray-400 mt-0.5 shrink-0" />
      )}
      <span
        className={`leading-5 ${
          isTodo ? "text-[var(--muted)]" : "text-[var(--text)]"
        }`}
      >
        {text}
      </span>
    </div>
  );
}

function Section({ icon: Icon, title, subtitle, tone = "default", defaultOpen = true, children }) {
  const [open, setOpen] = useState(defaultOpen);
  const toneRing =
    tone === "good" ? "text-emerald-700" :
    tone === "warn" ? "text-amber-700"  :
    "text-[var(--text-primary)]";

  return (
    <div className="rounded-[12px] border border-[var(--border)] bg-white/70">
      <button
        type="button"
        onClick={() => setOpen((s) => !s)}
        className="w-full flex items-center gap-3 px-3.5 py-2.5"
      >
        <span className={`grid place-items-center h-7 w-7 rounded-full border border-[var(--border)] bg-white ${toneRing}`}>
          <Icon size={16} />
        </span>
        <div className="min-w-0 flex-1 text-left">
          <div className="text-[13px] font-semibold text-[var(--text-primary)] truncate">{title}</div>
          {subtitle ? <div className="text-[11px] text-[var(--muted)]">{subtitle}</div> : null}
        </div>
        {open ? <ChevronDown size={16} className="text-[var(--muted)]" /> : <ChevronRight size={16} className="text-[var(--muted)]" />}
      </button>

      <div className={`transition-[grid-template-rows] duration-300 ease-out grid ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
        <div className="overflow-hidden border-t border-[var(--border)]">
          <div className="px-3.5 py-3">{children}</div>
        </div>
      </div>
    </div>
  );
}

/* ===================== Main Panel ===================== */
export default function CEResearchPanel({
  /** Controlled by parent/editor */
  query,
  onQueryChange,
  onStart,

  /** Comes from Metrics Strip pills; panel just reacts to it */
  seoMode = "basic",

  /** Optional live metrics */
  metrics,
}) {
  const [phase, setPhase] = useState("idle"); // idle | searching | results

  // Derive small “Basic SEO” statuses from metrics, if provided
  const status = useMemo(() => {
    const plag = metrics?.plagiarism ?? 0;
    const pk   = metrics?.primaryKeyword ?? 0;
    const lsi  = metrics?.lsiKeywords ?? 0;

    return {
      plag: { text: plag < 25 ? "Low similarity" : plag < 60 ? "Needs review" : "High similarity", tone: plag < 25 ? "good" : "warn" },
      pk:   { text: pk >= 70 ? "Good usage" : "Tune density", tone: pk >= 70 ? "good" : "warn" },
      lsi:  { text: lsi >= 60 ? "Good coverage" : "Add related terms", tone: lsi >= 60 ? "good" : "warn" },
    };
  }, [metrics]);

  const startSearch = () => {
    onStart?.(query);
    setPhase("searching");
  };

  /* ---------- Searching animation state ---------- */
  const SEARCH_STEPS = [
    "Exploring effective content marketing strategies to enhance your brand’s reach and engagement.",
    "The Focus Keyword was used in the SEO Meta description.",
    "The Focus Keyword was used in the URL.",
    "The Focus Keyword appears in the first 10% of the content…",
  ];
  const STEP_DELAY = 900;           // time between ticks (ms)
  const END_PAUSE = 700;            // small pause before jumping to results

  const [activeIndex, setActiveIndex] = useState(-1);
  const [doneMap, setDoneMap] = useState(Array(SEARCH_STEPS.length).fill(false));

  useEffect(() => {
    if (phase !== "searching") return;

    // reset on every new search
    setActiveIndex(0);
    setDoneMap(Array(SEARCH_STEPS.length).fill(false));

    let cancelled = false;

    const run = (i) => {
      if (cancelled) return;

      // show active row for a bit, then mark done and move ahead
      setActiveIndex(i);
      const t = setTimeout(() => {
        if (cancelled) return;
        setDoneMap((prev) => {
          const next = [...prev];
          next[i] = true;
          return next;
        });

        if (i < SEARCH_STEPS.length - 1) {
          run(i + 1);
        } else {
          // finished: brief pause, then results
          setTimeout(() => {
            if (!cancelled) setPhase("results");
          }, END_PAUSE);
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
  }, [phase]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ---------- PHASE 1: IDLE ---------- */
  if (phase === "idle") {
    return (
      <aside className="h-full rounded-r-[18px] border-l border-[var(--border)] bg-white/70 px-7 md:px-8 py-6 flex flex-col">
        <h3 className="text-[22px] font-semibold text-[var(--text-primary)] text-center">Research</h3>
        <p className="mt-3 mb-5 text-center text-[13px] leading-relaxed text-[var(--muted)]">
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
            <Search size={14} className="absolute left-2 top-2.5 text-[var(--muted)]" />
            <button
              type="button"
              aria-label="Query settings"
              className="absolute right-1.5 top-1.5 grid h-6 w-6 place-items-center rounded-full border border-[var(--border)] bg-white text-[var(--muted)] hover:bg-[var(--input)]"
            >
              <Settings size={14} />
            </button>
          </div>

          <button
            onClick={startSearch}
            className="mt-5 mx-auto block rounded-full border border-blue-300 px-6 py-2 text-[13px] font-medium text-blue-600 hover:bg-blue-50"
          >
            Start
          </button>
        </div>
      </aside>
    );
  }

  /* ---------- PHASE 2: SEARCHING (with sequential ticks) ---------- */
  if (phase === "searching") {
    return (
      <aside className="h-full rounded-r-[18px] border-l border-[var(--border)] bg-white/70 px-6 md:px-7 py-6">
        <div className="flex items-center gap-2 text-[14px] font-semibold text-[var(--text-primary)]">
          <Loader2 size={16} className="animate-spin text-blue-600" />
          Searching
          <Chip tone="info">Reference found</Chip>
        </div>

        <div className="mt-4 text-[13px] text-[var(--text-primary)] font-semibold">
          Content marketing strategies
        </div>

        <div className="mt-3 space-y-2">
          {SEARCH_STEPS.map((text, i) => {
            const status =
              doneMap[i] ? "done" : i === activeIndex ? "active" : "todo";
            return <Row key={i} status={status} text={text} />;
          })}
        </div>
      </aside>
    );
  }

  /* ---------- PHASE 3: RESULTS ---------- */
  const renderResultsByMode = () => {
    if (seoMode === "advance") {
      return (
        <>
          <Section icon={ListChecks} title="Optimize" subtitle="Deeper checks & opportunities" tone="warn" defaultOpen>
            <ul className="list-disc pl-5 text-[13px] space-y-1">
              <li>Add keyword variations to H2/H3 where natural.</li>
              <li>Create internal links to topically-related pillar pages.</li>
              <li>Cover missing subtopics surfaced by SERP gap analysis.</li>
            </ul>
          </Section>

          <Section icon={List} title="Research Links" subtitle="External references" defaultOpen={false}>
            <ul className="list-disc pl-5 text-[13px] space-y-1">
              <li>Top 3 authoritative sources mapped to claims.</li>
              <li>Suggested anchor text for each outbound link.</li>
            </ul>
          </Section>

          <Section icon={List} title="FAQ Candidates" subtitle="People Also Ask" defaultOpen={false}>
            <ul className="list-disc pl-5 text-[13px] space-y-1">
              <li>What is SaaS content marketing?</li>
              <li>How often should I publish?</li>
              <li>Which metrics matter most?</li>
            </ul>
          </Section>
        </>
      );
    }

    if (seoMode === "details") {
      return (
        <>
          <Section icon={List} title="SERP Snapshot" subtitle="Competitor mentions & coverage" defaultOpen>
            <ul className="list-disc pl-5 text-[13px] space-y-1">
              <li>Avg. mentions: Title readability (5), Your mentions: 2</li>
              <li>Top domains: greenleafinsights.com, etc.</li>
            </ul>
          </Section>

          <Section icon={List} title="Content Diff" subtitle="What competitors include" defaultOpen={false}>
            <ul className="list-disc pl-5 text-[13px] space-y-1">
              <li>Missed section: Case studies / proof.</li>
              <li>Missed element: Comparison table.</li>
            </ul>
          </Section>
        </>
      );
    }

    // default: "basic"
    return (
      <>
        <div className="mb-1 flex items-center gap-2 rounded-[10px] border border-amber-200 bg-amber-50 px-3 py-2">
          <TriangleAlert size={16} className="text-amber-700" />
          <div className="text-[13px] font-medium text-amber-800">Fix this</div>
          <div className="ml-auto text-[11px] text-amber-800/80">
            Once done, switch to ADVANCE for deep research
          </div>
        </div>

        <Section
          icon={ListChecks}
          title="Basic SEO"
          subtitle="Quick health checks"
          tone={status.plag.tone === "warn" ? "warn" : "good"}
          defaultOpen={true}
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[13px]">
              <span>Plagiarism</span>
              <Chip tone={status.plag.tone}>{status.plag.text}</Chip>
            </div>
            <div className="flex items-center justify-between text-[13px]">
              <span>Primary Keyword</span>
              <Chip tone={status.pk.tone}>{status.pk.text}</Chip>
            </div>
            <div className="flex items-center justify-between text-[13px]">
              <span>LSI Keywords</span>
              <Chip tone={status.lsi.tone}>{status.lsi.text}</Chip>
            </div>
          </div>
        </Section>

        <Section icon={TriangleAlert} title="Additional" subtitle="4 Errors" tone="warn" defaultOpen={false}>
          <div className="space-y-2 text-[13px]">
            <Row status="todo" text="Focus keyword appears twice in the title — use only once." />
            <Row status="todo" text="Missing keyword variation in meta description." />
            <Row status="todo" text="URL is long — shorten /best-seo-tools-2025-for-digital-marketing-guide/." />
            <Row status="todo" text="Intro doesn’t match intent — add how the tools improve rankings." />
          </div>
        </Section>

        <Section icon={List} title="Title Readability" subtitle="All Good" tone="good" defaultOpen={false}>
          <ul className="list-disc pl-5 text-[13px] space-y-1">
            <li>Concise (under 60 chars)</li>
            <li>Benefit-led: “Best SEO Tools 2025 to Improve Google Rankings”</li>
            <li>Numbers/Year add relevance; scannable wording</li>
          </ul>
        </Section>

        <Section icon={List} title="Content Readability" subtitle="All Good" tone="good" defaultOpen={false}>
          <ul className="list-disc pl-5 text-[13px] space-y-1">
            <li>Short, active sentences; 2–3 sentence paragraphs</li>
            <li>Headings (H2/H3) break the flow</li>
            <li>Lists & tables for clarity</li>
          </ul>
        </Section>
      </>
    );
  };

  return (
    <aside className="h-full rounded-r-[18px] border-l border-[var(--border)] bg-white/70 px-6 md:px-7 py-6 flex flex-col gap-3">
      {renderResultsByMode()}
    </aside>
  );
}
