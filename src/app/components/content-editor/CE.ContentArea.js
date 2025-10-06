"use client";

import React from "react";
import CEToolbar from "./CE.Toolbar";
import CECanvas from "./CE.Canvas";
import CEResearchPanel from "./CE.ResearchPanel";

export default function CEContentArea({
  activeTab, onTabChange, lastEdited, title,
  query, onQueryChange, onStartResearch,
}) {
  return (
    <section>
      <CEToolbar activeTab={activeTab} onTabChange={onTabChange} lastEdited={lastEdited} />
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-4 mt-2">
        <CECanvas title={title} />
        <div className="hidden lg:block">
          <CEResearchPanel query={query} onQueryChange={onQueryChange} onStart={onStartResearch} />
        </div>
      </div>
    </section>
  );
}