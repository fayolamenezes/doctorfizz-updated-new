"use client";

import React from "react";

export default function CEResearchPanel({ query, onQueryChange, onStart }) {
  return (
    <aside className="rounded-[12px] border border-[var(--border)] bg-white/70 p-6 shadow-sm h-fit">
      <h3 className="text-lg font-semibold text-center">Research</h3>
      <p className="text-[13px] text-[var(--muted)] text-center mt-2 mb-4">
        Process the top 20 Google search results<br />for the following search query:
      </p>
      <input
        value={query}
        onChange={(e) => onQueryChange?.(e.target.value)}
        placeholder="Enter search query"
        className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-panel)] px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
      />
      <div className="mt-4 flex justify-center">
        <button
          onClick={() => onStart?.(query)}
          className="px-5 py-2 rounded-full border border-blue-300 text-blue-600 hover:bg-blue-50 text-sm"
        >
          Start
        </button>
      </div>
    </aside>
  );
}