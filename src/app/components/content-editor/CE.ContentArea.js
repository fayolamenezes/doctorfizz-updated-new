"use client";

import React, { useRef } from "react";
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
  content,
  setContent,
}) {
  const editorRef = useRef(null);

  return (
    <div className="
        grid grid-cols-[2fr_1fr]
        items-stretch gap-0
        rounded-[18px] overflow-hidden
        border border-[var(--border)] bg-white/70
      ">
      {/* LEFT: toolbar + canvas */}
      <div className="min-w-0">
        <CEToolbar
          activeTab={activeTab}
          onTabChange={onTabChange}
          lastEdited={lastEdited}
          editorRef={editorRef}
        />
        <CECanvas ref={editorRef} title={title} content={content} setContent={setContent} />
      </div>

      {/* RIGHT: research column */}
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
