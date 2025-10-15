"use client";

import React, { useState } from "react";
import { ChevronRight, Search as SearchIcon } from "lucide-react";

/* helpers */
function IconHintButton({ onClick, label = "Paste to editor" }) {
  return (
    <button type="button" onClick={onClick} aria-label={label} className="grid place-items-center h-7 w-7 rounded-md border border-gray-200 bg-white/90 text-gray-600 shadow-sm hover:bg-gray-50 focus:outline-none">
      <div className="relative" style={{ width: 12, height: 12 }}>
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[2px] bg-gray-600" />
        <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[2px] bg-gray-600" />
      </div>
    </button>
  );
}
function BrandDot({ label }) {
  return <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md border border-gray-200 bg-gray-50 text-[10px] font-semibold text-gray-700">{label.slice(0,1).toUpperCase()}</span>;
}
function FAQRow({ iconLabel, title, source, onPaste }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white">
      <button className="w-full px-3 py-2 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3 text-left">
          <BrandDot label={iconLabel} />
          <div className="min-w-0">
            <div className="text-[13px] font-semibold text-gray-800 truncate">{title}</div>
            <div className="text-[11px] text-gray-500">Source : {source}</div>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <IconHintButton onClick={(e) => { e.stopPropagation(); onPaste?.(title); }} />
          <ChevronRight size={18} className="text-gray-400" />
        </div>
      </button>
    </div>
  );
}

export default function SeoAdvancedFaqs({ onPasteToEditor }) {
  const [faqTab, setFaqTab] = useState("serp");
  const [kwFilter, setKwFilter] = useState("");
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

  return (
    <div className="mt-1 rounded-2xl border border-gray-200 bg-white p-3">
      <div className="flex items-center gap-3 border-b border-gray-100 px-1">
        {["serp","pa","quora","reddit"].map(k => (
          <button key={k} className={`px-2 pb-2 text-[12px] font-semibold ${faqTab === k ? "text-gray-900 border-b-2 border-gray-900" : "text-gray-500"}`} onClick={() => setFaqTab(k)}>
            {k === "serp" ? "SERP" : k === "pa" ? "People also ask" : k === "quora" ? "Quora" : "Reddit"}
          </button>
        ))}
      </div>

      <div className="relative mt-3">
        <input className="w-full h-8 rounded-lg border border-gray-200 bg-white px-8 text-[12px] outline-none focus:border-blue-300" placeholder="Filter by keywords" value={kwFilter} onChange={(e) => setKwFilter(e.target.value)} />
        <SearchIcon size={13} className="absolute left-2.5 top-2 text-gray-400" />
      </div>

      <div className="mt-3 space-y-2">
        {faqByTab[faqTab].filter((r) => r.title.toLowerCase().includes(kwFilter.toLowerCase())).map((r, idx) => (
          <FAQRow key={idx} {...r} onPaste={(text) => onPasteToEditor?.(text)} />
        ))}
      </div>
    </div>
  );
}