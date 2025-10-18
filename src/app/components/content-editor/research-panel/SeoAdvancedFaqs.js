"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ChevronRight, Search as SearchIcon } from "lucide-react";

/* ===============================
   Helper: Copy-to-Editor Button
================================ */
function IconHintButton({ onClick, label = "Paste to editor", size = 12, className = "" }) {
  return (
    <div className={`relative group ${className}`}>
      <button
        type="button"
        onClick={onClick}
        aria-label={label}
        className="grid place-items-center h-7 w-7 rounded-md border border-[var(--border)] bg-[var(--bg-panel)] text-[var(--text-primary)] shadow-sm hover:bg-[var(--bg-hover)] focus:outline-none transition-colors"
      >
        <Image
          src="/assets/copy.svg"
          alt="Paste"
          width={size}
          height={size}
          className="opacity-80"
        />
      </button>
      <span className="pointer-events-none absolute -top-7 right-0 rounded-md border border-[var(--border)] bg-[var(--bg-panel)] px-2 py-0.5 text-[10px] font-medium text-[var(--text-primary)] shadow-sm opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-100 whitespace-nowrap">
        {label}
      </span>
    </div>
  );
}

/* ===============================
   Helper: Brand Icon Dot
================================ */
function BrandDot({ label }) {
  return (
    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md border border-[var(--border)] bg-[var(--bg-panel)] text-[10px] font-semibold text-[var(--text-primary)] transition-colors">
      {label.slice(0, 1).toUpperCase()}
    </span>
  );
}

/* ===============================
   Single FAQ Row
================================ */
function FAQRow({ iconLabel, title, source, onPaste }) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-panel)] transition-colors">
      <button className="w-full px-3 py-2 flex items-center justify-between gap-3 text-left hover:bg-[var(--bg-hover)] transition-colors">
        <div className="flex min-w-0 items-center gap-3">
          <BrandDot label={iconLabel} />
          <div className="min-w-0">
            <div className="text-[13px] font-semibold text-[var(--text-primary)] truncate transition-colors">
              {title}
            </div>
            <div className="text-[11px] text-[var(--muted)] transition-colors">
              Source: {source}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <IconHintButton
            onClick={(e) => {
              e.stopPropagation();
              onPaste?.(title);
            }}
          />
          <ChevronRight size={18} className="text-[var(--muted)]" />
        </div>
      </button>
    </div>
  );
}

/* ===============================
   Main Component
================================ */
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
    <div className="mt-1 rounded-2xl border border-[var(--border)] bg-[var(--bg-panel)] p-3 transition-colors">
      {/* Tab Header */}
      <div className="flex items-center gap-3 border-b border-[var(--border)] px-1 transition-colors">
        {["serp", "pa", "quora", "reddit"].map((k) => (
          <button
            key={k}
            onClick={() => setFaqTab(k)}
            className={`px-2 pb-2 text-[12px] font-semibold transition-all ${
              faqTab === k
                ? "text-[var(--text-primary)] border-b-2 border-amber-400"
                : "text-[var(--muted)] hover:text-[var(--text-primary)]"
            }`}
          >
            {k === "serp"
              ? "SERP"
              : k === "pa"
              ? "People also ask"
              : k === "quora"
              ? "Quora"
              : "Reddit"}
          </button>
        ))}
      </div>

      {/* Filter input */}
      <div className="relative mt-3">
        <input
          className="w-full h-8 rounded-lg border border-[var(--border)] bg-[var(--bg-panel)] px-8 text-[12px] text-[var(--text-primary)] placeholder-[var(--muted)] outline-none focus:border-amber-400 transition-colors"
          placeholder="Filter by keywords"
          value={kwFilter}
          onChange={(e) => setKwFilter(e.target.value)}
        />
        <SearchIcon size={13} className="absolute left-2.5 top-2 text-[var(--muted)]" />
      </div>

      {/* FAQ list */}
      <div className="mt-3 space-y-2">
        {faqByTab[faqTab]
          .filter((r) => r.title.toLowerCase().includes(kwFilter.toLowerCase()))
          .map((r, idx) => (
            <FAQRow key={idx} {...r} onPaste={(text) => onPasteToEditor?.(text)} />
          ))}
      </div>
    </div>
  );
}
