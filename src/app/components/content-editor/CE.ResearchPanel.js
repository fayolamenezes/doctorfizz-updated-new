"use client";

import { useState } from "react";
import { WandSparkles, Link as LinkIcon, HelpCircle, FlaskConical, Info, Rocket } from "lucide-react";

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
  // ⬅️ No "details" here — it's controlled by the Metrics Strip pill
];

export default function CEResearchPanel({
  query = "",
  onQueryChange,
  onStart,
  seoMode = "basic",
  metrics,
  onFix,
  onPasteToEditor,
  editorContent = "",
}) {
  const [phase, setPhase] = useState("idle"); // idle | searching | results
  const [tab, setTab] = useState("opt");      // opt | links | faqs | research

  // Route by seoMode:
  // - "basic"  => show SeoBasics (guided checklist)
  // - "details"=> show SeoDetails (driven by Metrics Strip pill)
  // - "advanced"=> show the advanced tabs below
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

  if (seoMode === "details") {
    return <SeoDetails onPasteToEditor={onPasteToEditor} />;
  }

  // Advanced mode: show Optimize/Links/FAQ's/Research tabs
  return (
    <aside className="h-full rounded-r-[18px] border-l border-[var(--border)] bg-white/70 px-5 md:px-6 py-5 flex flex-col gap-3">
      <div className="flex items-center justify-between gap-1 w-full flex-nowrap">
        {TABS.slice(1).map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            title={label}
            className={`flex items-center justify-center gap-1 rounded-lg border flex-auto px-2.5 py-1.5 text-[12px] font-medium transition-colors ${
              tab === key
                ? "bg-white border-amber-300 text-amber-700"
                : "bg-white/70 border-gray-200 text-gray-600 hover:bg-white"
            }`}
            style={{ minWidth: "fit-content", whiteSpace: "nowrap" }}
          >
            <Icon size={13} className="shrink-0" />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {tab === "opt" && <SeoAdvancedOptimize onPasteToEditor={onPasteToEditor} />}
      {tab === "links" && <SeoAdvancedLinks onPasteToEditor={onPasteToEditor} />}
      {tab === "faqs" && <SeoAdvancedFaqs onPasteToEditor={onPasteToEditor} />}
      {tab === "research" && (
        <SeoAdvancedResearch editorContent={editorContent} onPasteToEditor={onPasteToEditor} />
      )}
    </aside>
  );
}
