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
  { key: "details", label: "Details", icon: Info },
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
  const [tab, setTab] = useState("opt");      // opt | links | faqs | research | details

  if (seoMode !== "advanced") {
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

  return (
    <aside className="h-full rounded-r-[18px] border-l border-[var(--border)] bg-white/70 px-5 md:px-6 py-5 flex flex-col gap-3">
      <div className="flex items-center gap-2 flex-nowrap">
        {TABS.slice(1).map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-[12px] font-medium ${
              tab === key ? "bg-white border-amber-300 text-amber-700" : "bg-white/70 border-gray-200 text-gray-600 hover:bg-white"
            }`}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>

      {tab === "opt" && <SeoAdvancedOptimize onPasteToEditor={onPasteToEditor} />}
      {tab === "links" && <SeoAdvancedLinks onPasteToEditor={onPasteToEditor} />}
      {tab === "faqs" && <SeoAdvancedFaqs onPasteToEditor={onPasteToEditor} />}
      {tab === "research" && (
        <SeoAdvancedResearch editorContent={editorContent} onPasteToEditor={onPasteToEditor} />
      )}
      {tab === "details" && <SeoDetails onPasteToEditor={onPasteToEditor} />}
    </aside>
  );
}