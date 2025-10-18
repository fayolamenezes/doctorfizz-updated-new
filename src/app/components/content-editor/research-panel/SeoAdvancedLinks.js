"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ChevronRight, Search as SearchIcon } from "lucide-react";

/* =========================
   Copy button (uses tokens)
========================= */
function IconHintButton({ onClick, label = "Paste to editor", size = 12, className = "" }) {
  return (
    <div className={`relative group ${className}`}>
      <button
        type="button"
        onClick={onClick}
        aria-label={label}
        className="grid place-items-center h-8 w-8 rounded-md border border-[var(--border)] bg-white/90 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none
                   dark:bg-[var(--bg-panel)] dark:text-[var(--text-primary)] dark:hover:bg-[var(--bg-hover)]"
      >
        <Image src="/assets/copy.svg" width={size} height={size} alt="Paste" className="opacity-80" />
      </button>
      <span
        className="pointer-events-none absolute -top-7 right-0 rounded-md border border-[var(--border)] bg-white px-2 py-0.5 text-[10px] font-medium text-gray-700 shadow-sm opacity-0 transition-opacity duration-75 whitespace-nowrap
                   group-hover:opacity-100 group-focus-within:opacity-100
                   dark:bg-[var(--bg-panel)] dark:text-[var(--text-primary)]"
      >
        {label}
      </span>
    </div>
  );
}

/* =========================
   Rank badge
========================= */
function BadgeScore({ score }) {
  // 3 tones that still read well in dark mode
  const tone =
    score >= 15
      ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/25 dark:text-amber-300 dark:border-amber-700/60"
      : score >= 10
      ? "bg-gray-100 text-gray-700 border-gray-200 dark:bg-neutral-800 dark:text-neutral-200 dark:border-neutral-700"
      : "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/25 dark:text-emerald-300 dark:border-emerald-700/60";

  return (
    <span className={`inline-flex h-8 min-w-[34px] items-center justify-center rounded-md border px-1.5 text-[12px] font-semibold ${tone}`}>
      {score}
    </span>
  );
}

/* =========================
   Single list row
========================= */
function LinkRow({ rankScore, domain, sources, onPaste }) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-white shadow-sm
                    dark:bg-[var(--bg-panel)]">
      <button
        className="w-full px-4 py-3 flex items-center justify-between gap-3 text-left rounded-2xl
                   hover:bg-gray-50 dark:hover:bg-[var(--bg-hover)]"
      >
        <div className="flex min-w-0 items-center gap-3">
          <BadgeScore score={rankScore} />
          <div className="min-w-0">
            <div className="truncate text-[14px] font-semibold text-gray-900 dark:text-[var(--text-primary)]">
              {domain}
            </div>
            <div className="text-[11.5px] text-gray-500 dark:text-[var(--muted)]">
              Source : {sources}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <IconHintButton
            onClick={(e) => {
              e.stopPropagation();
              onPaste?.(domain);
            }}
          />
          <ChevronRight size={18} className="text-gray-400 dark:text-[var(--muted)]" />
        </div>
      </button>
    </div>
  );
}

/* =========================
   Main
========================= */
export default function SeoAdvancedLinks({ onPasteToEditor }) {
  const [kwFilter, setKwFilter] = useState("");
  const [linkTab, setLinkTab] = useState("external");

  const linkRowsExternal = [
    { rankScore: 7, domain: "Titlereadability.com", sources: 15 },
    { rankScore: 16, domain: "Strategiesmaker.com", sources: 5 },
    { rankScore: 13, domain: "Readabilityskills.gov.in", sources: 15 },
    { rankScore: 10, domain: "Titlebility.org", sources: 9 },
  ];

  const linkRowsInternal = [
    { rankScore: 9, domain: "yourdomain.com/blog/content-marketing", sources: 12 },
    { rankScore: 11, domain: "yourdomain.com/strategy/guide", sources: 7 },
    { rankScore: 6, domain: "yourdomain.com/resources/tools", sources: 4 },
  ];

  return (
    <div
      className="mt-1 rounded-2xl border border-[var(--border)] bg-white p-4
                 dark:bg-[var(--bg-panel)]"
    >
      {/* Tabs header */}
      <div className="flex items-center gap-6 border-b border-[var(--border)] px-1">
        <button
          onClick={() => setLinkTab("external")}
          className={`relative px-1 pb-2 text-[13px] font-semibold transition-colors
            ${linkTab === "external" ? "text-gray-900 dark:text-[var(--text-primary)]" : "text-gray-500 dark:text-[var(--muted)]"}`}
        >
          External Link
          {linkTab === "external" && (
            <span className="absolute -bottom-[1px] left-0 right-0 h-[2px] rounded-full bg-amber-400" />
          )}
        </button>
        <button
          onClick={() => setLinkTab("internal")}
          className={`relative px-1 pb-2 text-[13px] font-semibold transition-colors
            ${linkTab === "internal" ? "text-gray-900 dark:text-[var(--text-primary)]" : "text-gray-500 dark:text-[var(--muted)]"}`}
        >
          Internal link
          {linkTab === "internal" && (
            <span className="absolute -bottom-[1px] left-0 right-0 h-[2px] rounded-full bg-amber-400" />
          )}
        </button>
      </div>

      {/* Overview card */}
      <div
        className="mt-3 rounded-2xl border border-[var(--border)] bg-gray-100/80 px-4 py-3
                   text-gray-800 shadow-inner
                   dark:bg-[var(--bg-hover)] dark:text-[var(--text-primary)]"
      >
        <div className="text-[28px] leading-7 font-extrabold">786</div>
        <div className="text-[12px] mt-0.5 text-gray-600 dark:text-[var(--muted)]">
          Number of External Links
        </div>
        <div className="text-[12px] mt-1 text-gray-600 dark:text-[var(--muted)]">
          Top search results link to pages from{" "}
          <span className="font-semibold text-gray-900 dark:text-[var(--text-primary)]">19 domains</span>
        </div>
      </div>

      {/* Filter */}
      <div className="relative mt-3">
        <input
          className="w-full h-10 rounded-xl border border-[var(--border)] bg-white px-9 text-[13px] text-gray-800 placeholder-gray-400 outline-none focus:border-amber-400
                     dark:bg-[var(--bg-panel)] dark:text-[var(--text-primary)] dark:placeholder-[var(--muted)]"
          placeholder="Filter by keywords"
          value={kwFilter}
          onChange={(e) => setKwFilter(e.target.value)}
        />
        <SearchIcon size={14} className="absolute left-3 top-[11px] text-gray-400 dark:text-[var(--muted)]" />
      </div>

      {/* List */}
      <div className="mt-3 space-y-3">
        {(linkTab === "external" ? linkRowsExternal : linkRowsInternal)
          .filter((r) => r.domain.toLowerCase().includes(kwFilter.toLowerCase()))
          .map((r, idx) => (
            <LinkRow key={idx} {...r} onPaste={(text) => onPasteToEditor?.(text)} />
          ))}
      </div>
    </div>
  );
}
