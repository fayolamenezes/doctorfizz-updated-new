// components/ContentEditor.js 
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import CENavbar       from "./content-editor/CE.Navbar";
import CEMetricsStrip from "./content-editor/CE.MetricsStrip";
import CEContentArea  from "./content-editor/CE.ContentArea";

/* ---------- utils ---------- */
function isBlankHtml(html) {
  if (!html) return true;
  return String(html).replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim() === "";
}
const norm = (s) =>
  String(s || "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();

/* ========================================================== */
export default function ContentEditor({ data, onBackToDashboard }) {
  /* ---------- load contenteditor.json from public/data ---------- */
  const [config, setConfig] = useState(null);
  const [configError, setConfigError] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch("/data/contenteditor.json", { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (mounted) setConfig(json);
      } catch (e) {
        if (mounted) setConfigError(String(e));
      }
    })();
    return () => { mounted = false; };
  }, []);

  /* ---------- pick page config by slug or title ---------- */
  const pageKey =
    data?.slug ||
    data?.page ||
    data?.id ||
    norm(data?.title) ||
    "";

  const pageConfig = useMemo(() => {
    if (!config?.pages?.length) return null;

    let hit =
      config.pages.find((p) => norm(p.slug) === norm(pageKey)) ||
      config.pages.find((p) => norm(p.id) === norm(pageKey));

    if (!hit && data?.title) {
      hit = config.pages.find((p) => norm(p.title) === norm(data.title));
    }

    return hit || config.pages[0] || null;
  }, [config, pageKey, data?.title]);

  /* ---------- state ---------- */
  const [title, setTitle] = useState(data?.title || "Untitled");
  const [content, setContent] = useState(
    typeof data?.content === "string" ? data.content : ""
  );
  const [activeTab, setActiveTab] = useState("content");
  const [seoMode, setSeoMode] = useState("basic");
  const [lastEdited, setLastEdited] = useState(data?.ui?.lastEdited || "1 day ago");
  const [query, setQuery] = useState(data?.ui?.query || data?.primaryKeyword || "");

  /* ---------- resolved keywords/targets (config → data → defaults) ---------- */
  const PRIMARY_KEYWORD = useMemo(
    () =>
      norm(
        query || // ← live UI query first
        data?.primaryKeyword ||
        pageConfig?.primaryKeyword ||
        "content marketing"
      ),
    [query, data?.primaryKeyword, pageConfig?.primaryKeyword]
  );

  const LSI = useMemo(
    () =>
      (Array.isArray(data?.lsiKeywords) && data.lsiKeywords.length
        ? data.lsiKeywords
        : Array.isArray(pageConfig?.lsiKeywords)
        ? pageConfig.lsiKeywords
        : [
            "strategy",
            "engagement",
            "brand",
            "seo",
            "audience",
            "education",
            "trust",
            "subscription",
            "saas",
            "decision-making",
          ]
      ).map((k) => norm(k)),
    [data?.lsiKeywords, pageConfig?.lsiKeywords]
  );

  const WORD_TARGET_FROM_DATA =
    data?.metrics?.wordTarget ??
    data?.wordTarget ??
    pageConfig?.wordTarget ??
    1480;

  /* ---------- default content includes the PK so PK% isn’t stuck at 0 ---------- */
  const DEFAULT_CONTENT = useMemo(() => {
    const safeTitle = (data?.title || "Content Title")
      .split(" ")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
    return `
      <h1>${safeTitle}</h1>
      <p>Start writing about <strong>${PRIMARY_KEYWORD}</strong>. Include related ideas like ${LSI.slice(0,3).join(", ")} and keep it natural.</p>
    `;
  }, [data?.title, PRIMARY_KEYWORD, LSI]);

  /* ---------- metrics state (computed by CE.ContentArea) ---------- */
  const [metrics, setMetrics] = useState({
    plagiarism: 0,
    primaryKeyword: 0,
    wordCount: 0,
    wordTarget: WORD_TARGET_FROM_DATA,
    lsiKeywords: 0,
  });

  /* ---------- keep URL on #editor and restore persisted state ---------- */
  const restoredRef = useRef(false);

  useEffect(() => {
    // force hash to #editor
    if (typeof window !== "undefined" && window.location.hash !== "#editor") {
      window.location.hash = "#editor";
    }

    // restore saved state once
    try {
      const raw = typeof window !== "undefined" && localStorage.getItem("content-editor-state");
      if (raw) {
        const saved = JSON.parse(raw);
        if (saved.title) setTitle(saved.title);
        if (saved.content) setContent(saved.content);
        if (typeof saved.query === "string") setQuery(saved.query);
      }
    } catch {}
    restoredRef.current = true;
  }, []);

  // persist editor state in localStorage
  useEffect(() => {
    try {
      const payload = { title, content, query };
      localStorage.setItem("content-editor-state", JSON.stringify(payload));
    } catch {}
  }, [title, content, query]);

  /* ---------- sync from dashboard payload/config changes ---------- */
  useEffect(() => {
    if (!restoredRef.current) {
      if (data?.title) setTitle(data.title);
      if (typeof data?.content === "string") {
        setContent(data.content);
      } else {
        setContent(DEFAULT_CONTENT);
      }
      setQuery(data?.ui?.query || data?.primaryKeyword || "");
    } else if (!data?.content && isBlankHtml(content)) {
      setContent(DEFAULT_CONTENT);
    }

    setLastEdited(data?.ui?.lastEdited || "1 day ago");
    setMetrics((m) => ({
      ...m,
      wordTarget:
        (data?.metrics?.wordTarget ??
          data?.wordTarget ??
          pageConfig?.wordTarget ??
          m.wordTarget ??
          1480),
    }));
  }, [data, pageConfig, DEFAULT_CONTENT, content]);

  /* ---------- render ---------- */
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] transition-colors duration-300">
      <main className="bg-[var(--bg-panel)] px-2 py-6 sm:px-1 lg:px-2 xl:px-3 transition-colors duration-300">
        <CENavbar
          title={title}
          onBack={onBackToDashboard}
          onTitleChange={setTitle}
          searchVolume={data?.navbar?.searchVolume ?? data?.searchVolume}
          keywordDifficulty={data?.navbar?.keywordDifficulty ?? data?.keywordDifficulty}
        />

        <CEMetricsStrip
          metrics={metrics}
          seoMode={seoMode}
          onChangeSeoMode={setSeoMode}
        />

        <CEContentArea
          title={title}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          lastEdited={lastEdited}
          query={query}
          onQueryChange={setQuery}
          onStart={() => {}}
          seoMode={seoMode}
          metrics={metrics}
          setMetrics={setMetrics}
          content={content}
          setContent={(html) => {
            setContent(html);
            setLastEdited("a few seconds ago");
          }}
          // pass the live-resolved primary keyword & LSI (highlighting + fallback)
          primaryKeyword={PRIMARY_KEYWORD}
          lsiKeywords={LSI}
        />

        {process.env.NODE_ENV !== "production" && configError && (
          <p className="mt-2 text-xs text-red-600">Config load error: {configError}</p>
        )}
      </main>
    </div>
  );
}
