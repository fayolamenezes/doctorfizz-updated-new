"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
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
  seoMode: seoModeProp,
  metrics: metricsProp,
  content,
  setContent,
}) {
  const editorRef = useRef(null);

  // Shared keywords (used by metrics + in-editor highlighting)
  const PRIMARY_KEYWORD = useMemo(() => "content marketing", []);
  const LSI_KEYWORDS = useMemo(
    () => ["strategy", "strategies", "SEO", "brand", "engagement", "conversion", "readability"],
    []
  );

  // Local, live metrics (fallback if parent doesn’t supply)
  const [seoMode] = useState(seoModeProp ?? "advanced");
  const [metricsInternal, setMetricsInternal] = useState({
    plagiarism: 0,
    primaryKeyword: 0,
    wordCount: 0,
    wordTarget: 1480,
    lsiKeywords: 0,
    statuses: {
      wordCount: { label: "—", color: "text-[var(--muted)]" },
      primaryKeyword: { label: "—", color: "text-[var(--muted)]" },
      lsiKeywords: { label: "—", color: "text-[var(--muted)]" },
    },
  });

  // Recompute metrics whenever content changes
  useEffect(() => {
    const html = String(content || "");
    const text = html
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase();

    if (!text) {
      setMetricsInternal((m) => ({
        ...m,
        wordCount: 0,
        primaryKeyword: 0,
        lsiKeywords: 0,
        statuses: {
          wordCount: { label: "Empty", color: "text-[var(--muted)]" },
          primaryKeyword: { label: "Needs Review", color: "text-red-600" },
          lsiKeywords: { label: "Needs Review", color: "text-red-600" },
        },
      }));
      return;
    }

    const wordCount = text.split(/\s+/).filter(Boolean).length;
    const pkMatches = (text.match(new RegExp(`\\b${PRIMARY_KEYWORD}\\b`, "gi")) || []).length;
    let lsiCount = 0;
    LSI_KEYWORDS.forEach((kw) => {
      const safe = kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      lsiCount += (text.match(new RegExp(`\\b${safe}\\b`, "gi")) || []).length;
    });

    const primaryKeyword = Math.min(100, pkMatches * 25);
    const lsiKeywords = Math.min(100, lsiCount * 15);

    const status = (val) => {
      if (val >= 75) return { label: "Good", color: "text-green-600" };
      if (val >= 40) return { label: "Moderate", color: "text-yellow-600" };
      return { label: "Needs Review", color: "text-red-600" };
    };

    setMetricsInternal({
      plagiarism: 0,
      primaryKeyword,
      wordCount,
      wordTarget: 1480,
      lsiKeywords,
      statuses: {
        primaryKeyword: status(primaryKeyword),
        lsiKeywords: status(lsiKeywords),
        wordCount:
          wordCount > 1200
            ? { label: "Good", color: "text-green-600" }
            : wordCount > 600
            ? { label: "Moderate", color: "text-yellow-600" }
            : { label: "Needs Review", color: "text-red-600" },
      },
    });
  }, [content, PRIMARY_KEYWORD, LSI_KEYWORDS]);

  const metrics = metricsProp ?? metricsInternal;
  const effectiveSeoMode = seoModeProp ?? seoMode;

  return (
    <div className="grid grid-cols-[2fr_1fr] items-stretch gap-0 rounded-[18px] overflow-hidden border border-[var(--border)] bg-[var(--bg-panel)] transition-colors">
      {/* LEFT: toolbar + canvas */}
      <div className="min-w-0 border-r border-[var(--border)] bg-[var(--bg-panel)] transition-colors">
        <CEToolbar
          activeTab={activeTab}
          onTabChange={onTabChange}
          lastEdited={lastEdited}
          editorRef={editorRef}
        />

        <div className="bg-[var(--bg-panel)] transition-colors">
          <CECanvas
            ref={editorRef}
            title={title}
            content={content}
            setContent={setContent}
            primaryKeyword={PRIMARY_KEYWORD}
            lsiKeywords={LSI_KEYWORDS}
            highlightEnabled
          />
        </div>
      </div>

      {/* RIGHT: research panel */}
      <div className="min-w-[320px] border-l border-[var(--border)] bg-[var(--bg-panel)] transition-colors">
        <CEResearchPanel
          query={query}
          onQueryChange={onQueryChange}
          onStart={onStart}
          seoMode={effectiveSeoMode}
          metrics={metrics}
        />
      </div>
    </div>
  );
}
