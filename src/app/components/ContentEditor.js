"use client";

import React, { useState } from "react";
// ⛔ Removed CE.Sidebar so we don't render two sidebars
import CENavbar from "./content-editor/CE.Navbar";
import CEMetricsStrip from "./content-editor/CE.MetricsStrip";
import CEContentArea from "./content-editor/CE.ContentArea";

export default function ContentEditor({ onBackToDashboard }) {
  const [title, setTitle] = useState("Untitled");
  const [activeTab, setActiveTab] = useState("content"); // content | summary | final
  const [seoMode, setSeoMode] = useState("basic");       // basic | advance | details
  const [metrics, setMetrics] = useState({
    plagiarism: null,
    primaryKeyword: null,
    wordCount: null,
    lsiKeywords: null,
  });
  const [lastEdited, setLastEdited] = useState("1 day ago");
  const [query, setQuery] = useState(""); // research query input

  return (
    <div className="min-h-screen">
      <main className="bg-[var(--bg-panel)] px-2 py-6 sm:px-3 lg:px-4 xl:px-5">
        <CENavbar
          title={title}
          onBack={onBackToDashboard}
          onTitleChange={setTitle}
        />

        <CEMetricsStrip
          metrics={metrics}
          seoMode={seoMode}
          onChangeSeoMode={setSeoMode}
        />

        <CEContentArea
          activeTab={activeTab}
          onTabChange={setActiveTab}
          lastEdited={lastEdited}
          title={title}
          query={query}
          onQueryChange={setQuery}
          onStartResearch={() => {
            /* TODO: fetch SERP */
          }}
        />
      </main>
    </div>
  );
}
