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
function BadgeScore({ score }) {
  const tone = score >= 15 ? "bg-amber-50 text-amber-700 border-amber-200" : score >= 10 ? "bg-gray-100 text-gray-700 border-gray-200" : "bg-emerald-50 text-emerald-700 border-emerald-200";
  return <span className={`inline-flex h-7 min-w-[32px] items-center justify-center rounded-md border px-1 text-[12px] font-semibold ${tone}`}>{score}</span>;
}
function LinkRow({ rankScore, domain, sources, onPaste }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white">
      <button className="w-full px-3 py-2 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3 text-left">
          <BadgeScore score={rankScore} />
          <div className="min-w-0">
            <div className="text-[13px] font-semibold text-gray-800 truncate">{domain}</div>
            <div className="text-[11px] text-gray-500">Source : {sources}</div>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <IconHintButton onClick={(e) => { e.stopPropagation(); onPaste?.(domain); }} />
          <ChevronRight size={18} className="text-gray-400" />
        </div>
      </button>
    </div>
  );
}

export default function SeoAdvancedLinks({ onPasteToEditor }) {
  const [kwFilter, setKwFilter] = useState("");
  const [linkTab, setLinkTab] = useState("external");
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

  return (
    <div className="mt-1 rounded-2xl border border-gray-200 bg-white p-3">
      <div className="flex items-center gap-6 border-b border-gray-100 px-1">
        <button className={`px-2 pb-2 text-[12px] font-semibold ${linkTab === "external" ? "text-gray-900 border-b-2 border-gray-900" : "text-gray-500"}`} onClick={() => setLinkTab("external")}>
          External Link
        </button>
        <button className={`px-2 pb-2 text-[12px] font-semibold ${linkTab === "internal" ? "text-gray-900 border-b-2 border-gray-900" : "text-gray-500"}`} onClick={() => setLinkTab("internal")}>
          Internal link
        </button>
      </div>

      <div className="mt-3 rounded-xl border border-gray-100 bg-gray-50 px-3 py-3">
        <div className="text-[24px] font-bold leading-6 text-gray-900">786</div>
        <div className="text-[11px] text-gray-600 -mt-0.5">Number of External Links</div>
        <div className="text-[11px] text-gray-500 mt-1">Top search results link to pages from <span className="font-medium">19 domains</span></div>
      </div>

      <div className="relative mt-3">
        <input className="w-full h-8 rounded-lg border border-gray-200 bg-white px-8 text-[12px] outline-none focus:border-blue-300" placeholder="Filter by keywords" value={kwFilter} onChange={(e) => setKwFilter(e.target.value)} />
        <SearchIcon size={13} className="absolute left-2.5 top-2 text-gray-400" />
      </div>

      <div className="mt-3 space-y-2">
        {(linkTab === "external" ? linkRowsExternal : linkRowsInternal)
          .filter((r) => r.domain.toLowerCase().includes(kwFilter.toLowerCase()))
          .map((r, idx) => (
            <LinkRow key={idx} {...r} onPaste={(text) => onPasteToEditor?.(text)} />
          ))}
      </div>
    </div>
  );
}