"use client";

import { useState } from "react";
import {
  WandSparkles,
  Link as LinkIcon,
  HelpCircle,
  FlaskConical,
  Rocket,
} from "lucide-react";

import SeoBasics from "./research-panel/SeoBasics";
import SeoAdvancedOptimize from "./research-panel/SeoAdvancedOptimize";
import SeoAdvancedLinks from "./research-panel/SeoAdvancedLinks";
import SeoAdvancedFaqs from "./research-panel/SeoAdvancedFaqs";
import SeoAdvancedResearch from "./research-panel/SeoAdvancedResearch";
import SeoDetails from "./research-panel/SeoDetails";

const TABS = [
  { key: "basics", label: "SEO Basics", icon: Rocket },
  { key: "opt", label: "Optimize", icon: WandSparkles },
  { key: "links", label: "Links", icon: LinkIcon },
  { key: "faqs", label: "FAQ’s", icon: HelpCircle },
  { key: "research", label: "Research", icon: FlaskConical },
  // ⬅️ No "details" tab here — it's controlled by the Metrics Strip pill (seoMode === "details")
];

export default function CEResearchPanel({
  query = "",
  onQueryChange,
  onStart,
  seoMode = "basic", // "basic" | "advanced" | "details"
  metrics,
  onFix,
  onPasteToEditor,
  editorContent = "",
}) {
  const [phase, setPhase] = useState("idle"); // idle | searching | results
  const [tab, setTab] = useState("opt"); // opt | links | faqs | research

  // Gate: only after a non-empty query AND Basics has started (searching/results)
  const canAccess = !!query?.trim() && (phase === "searching" || phase === "results");

  // BASIC mode (SEO Basics)
  if (seoMode === "basic") {
    return (
      <SeoBasics
        query={query}
        onQueryChange={onQueryChange}
        onStart={onStart}
        onFix={onFix}
        onPasteToEditor={onPasteToEditor}
        phase={phase}
        setPhase={setPhase}
      />
    );
  }

  // DETAILS view (from Metrics Strip) — guard until search started
  if (seoMode === "details") {
    if (!canAccess) {
      return (
        <aside className="h-full rounded-r-[18px] border-l border-[var(--border)] bg-[var(--bg-panel)] px-6 py-5 flex items-center justify-center transition-colors">
          <div className="text-center">
            <div className="text-[13px] font-semibold text-[var(--text-primary)]">
              Details locked
            </div>
            <p className="mt-1 text-[12px] text-[var(--muted)]">
              Type a keyword and click{" "}
              <span className="font-medium text-[var(--text-primary)]">Start</span> in
              SEO Basics to unlock Details.
            </p>
          </div>
        </aside>
      );
    }
    return <SeoDetails onPasteToEditor={onPasteToEditor} />;
  }

  // ADVANCED mode: Optimize / Links / FAQ’s / Research tabs — disabled until canAccess
  return (
    <aside className="h-full rounded-r-[18px] border-l border-[var(--border)] bg-[var(--bg-panel)] px-5 md:px-6 py-5 flex flex-col gap-3 transition-colors">
      {/* Top navigation tabs */}
      <div className="flex items-center justify-between gap-1 w-full flex-nowrap">
        {TABS.slice(1).map(({ key, label, icon: Icon }) => {
          const isActive = tab === key;
          const disabled = !canAccess;
          return (
            <button
              key={key}
              onClick={() => !disabled && setTab(key)}
              title={label}
              disabled={disabled}
              className={`flex items-center justify-center gap-1 rounded-lg border flex-auto px-2.5 py-1.5 text-[12px] font-medium transition-all
                ${
                  isActive
                    ? "bg-[var(--bg-panel)] border-amber-400 text-amber-600 shadow-sm"
                    : "bg-[var(--bg-panel)] border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--bg-hover)]"
                }
                ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
              `}
              style={{ minWidth: "fit-content", whiteSpace: "nowrap" }}
            >
              <Icon
                size={13}
                className={`shrink-0 ${
                  disabled
                    ? "text-[var(--muted)]"
                    : isActive
                    ? "text-amber-600"
                    : "text-[var(--muted)]"
                }`}
              />
              <span>{label}</span>
            </button>
          );
        })}
      </div>

      {/* Message if locked */}
      {!canAccess && (
        <div className="rounded-xl border border-amber-300 bg-amber-50/70 dark:bg-amber-950/40 px-3 py-2 text-[12px] text-amber-800 dark:text-amber-200 transition-colors">
          Type a keyword and click{" "}
          <span className="font-semibold text-amber-900 dark:text-amber-100">
            Start
          </span>{" "}
          in SEO Basics to unlock Advanced tools.
        </div>
      )}

      {/* Advanced panels (only visible when unlocked) */}
      {canAccess && (
        <>
          {tab === "opt" && <SeoAdvancedOptimize onPasteToEditor={onPasteToEditor} />}
          {tab === "links" && <SeoAdvancedLinks onPasteToEditor={onPasteToEditor} />}
          {tab === "faqs" && <SeoAdvancedFaqs onPasteToEditor={onPasteToEditor} />}
          {tab === "research" && (
            <SeoAdvancedResearch
              editorContent={editorContent}
              onPasteToEditor={onPasteToEditor}
            />
          )}
        </>
      )}
    </aside>
  );
}
