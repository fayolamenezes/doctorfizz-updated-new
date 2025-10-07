"use client";

import React, { useEffect, useState } from "react";
// ⛔ Removed CE.Sidebar so we don't render two sidebars
import CENavbar from "./content-editor/CE.Navbar";
import CEMetricsStrip from "./content-editor/CE.MetricsStrip";
import CEContentArea from "./content-editor/CE.ContentArea";

/**
 * Props:
 * - data: null -> open empty editor
 *         { title?: string, content?: string, ... } -> prefilled editor
 * - onBackToDashboard: () => void
 */
export default function ContentEditor({ data, onBackToDashboard }) {
  // seed from payload (or fall back to empty)
  const [title, setTitle] = useState(data?.title || "Untitled");
  const [content, setContent] = useState(data?.content || "");

  // tabs / seo modes / metrics (unchanged)
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

  // If the dashboard opens editor with a different card later, refresh state
  useEffect(() => {
    setTitle(data?.title || "Untitled");
    setContent(data?.content || "");
  }, [data]);

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
          onStart={() => {
            /* TODO: fetch SERP */
          }}
          /* NEW: pass content so editor shows prefilled text when available */
          content={content}
          setContent={setContent}
        />
      </main>
    </div>
  );
}
