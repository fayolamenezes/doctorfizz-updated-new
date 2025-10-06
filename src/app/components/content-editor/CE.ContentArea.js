// CE.ContentArea.js
"use client";

import React from "react";
import CEToolbar from "./CE.Toolbar";
import CECanvas from "./CE.Canvas";
import CEResearchPanel from "./CE.ResearchPanel";

export default function CEContentArea({
  title = "Untitled",
  activeTab,
  onTabChange,
  lastEdited = "1 day ago",
  query,
  onQueryChange,
  onStart,
}) {
  return (
    <div
      className="
        grid grid-cols-[2fr_1fr]       /* 66.7% : 33.3% */
        items-stretch gap-0
        rounded-[18px] overflow-hidden
        border border-[var(--border)] bg-white/70
      "
    >
      {/* LEFT: toolbar + canvas */}
      <div className="min-w-0">
        <CEToolbar
          activeTab={activeTab}
          onTabChange={onTabChange}
          lastEdited={lastEdited}
        />
        <CECanvas title={title} />
      </div>

      {/* RIGHT: research column (auto width ~33%) */}
      <div className="min-w-[320px]">
        <CEResearchPanel
          query={query}
          onQueryChange={onQueryChange}
          onStart={onStart}
        />
      </div>
    </div>
  );
}
