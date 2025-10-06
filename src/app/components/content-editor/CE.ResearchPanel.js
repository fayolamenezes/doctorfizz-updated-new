// CE.ResearchPanel.js
"use client";

import React from "react";
import { Settings } from "lucide-react";

export default function CEResearchPanel({ query, onQueryChange, onStart }) {
  return (
    <aside
      className="
        h-full
        rounded-r-[18px]
        border-l border-[var(--border)]
        bg-white/70
        px-7 md:px-8 py-8
        flex flex-col items-center
      "
    >
      <h3 className="text-[22px] font-semibold text-[var(--text-primary)]">Research</h3>

      <p className="mt-4 mb-6 text-center text-[13px] leading-relaxed text-[var(--muted)]">
        Process the top 20 Google search results
        <br className="hidden sm:block" />
        for the following search query:
      </p>

      <div className="relative w-full max-w-[420px]">
        <input
          value={query}
          onChange={(e) => onQueryChange?.(e.target.value)}
          placeholder="Enter search query"
          className="w-full h-9 rounded-lg border border-[var(--border)] bg-[var(--bg-panel)] px-3 pr-10 text-sm outline-none focus:border-blue-300"
        />
        <button
          type="button"
          aria-label="Query settings"
          className="absolute right-1.5 top-1.5 grid h-6 w-6 place-items-center rounded-full border border-[var(--border)] bg-white text-[var(--muted)] hover:bg-[var(--input)]"
        >
          <Settings size={14} />
        </button>
      </div>

      <button
        onClick={() => onStart?.(query)}
        className="mt-6 rounded-full border border-blue-300 px-6 py-2 text-[13px] font-medium text-blue-600 hover:bg-blue-50"
      >
        Start
      </button>
    </aside>
  );
}
