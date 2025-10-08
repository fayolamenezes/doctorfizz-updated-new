// components/ContentEditor.js
"use client";

import React, { useEffect, useMemo, useState } from "react";
import CENavbar      from "./content-editor/CE.Navbar";
import CEMetricsStrip from "./content-editor/CE.MetricsStrip";
import CEContentArea  from "./content-editor/CE.ContentArea";

/** Plain-text extractor for a chunk of HTML. */
function htmlToText(html) {
  if (!html) return "";
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
}

const clamp = (n, a = 0, b = 100) => Math.max(a, Math.min(b, n));

/** Treat whitespace-only or tag-only HTML as blank. */
function isBlankHtml(html) {
  if (!html) return true;
  return html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim() === "";
}

export default function ContentEditor({ data, onBackToDashboard }) {
  // Defaults for non-empty docs
  const PRIMARY_KEYWORD = (data?.primaryKeyword || "content marketing").toLowerCase();
  const LSI = useMemo(
    () =>
      (data?.lsiKeywords || [
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
      ]).map((s) => s.toLowerCase()),
    [data?.lsiKeywords]
  );

  const DEFAULT_CONTENT = `
    <h1>Content Marketing Strategies for SaaS</h1>
    <p>Software-as-a-Service (SaaS) companies face unique challenges when it comes to marketing. Unlike traditional products, SaaS offerings are subscription-based and rely on long-term relationships. To thrive, SaaS businesses need smart, scalable, and customer-focused <strong>content marketing</strong> strategies that build trust, educate users, and drive growth.</p>
    <h2>1. Understand Your Target Audience</h2>
    <ul>
      <li>Segment users (startups, SMBs, enterprises)</li>
      <li>Tailor content to founders, marketers, and IT teams</li>
      <li>Personalize messaging for better engagement</li>
    </ul>
    <h2>2. Build an Educational Content Hub</h2>
    <p>Create an educational hub to position your brand as a trusted authority.</p>
    <ul>
      <li><strong>Blog posts</strong>: How-to guides, tutorials, and industry insights.</li>
      <li><strong>Knowledge base</strong> &amp; <strong>help center</strong>: Documentation and FAQs.</li>
      <li><strong>Webinars</strong> &amp; <strong>videos</strong>: Visual content builds confidence and reduces churn.</li>
    </ul>
    <h2>3. Optimize for SEO &amp; Conversions</h2>
    <p>Use keyword research, internal linking, and on-page SEO. Add clear CTAs, social proof, and objection handling to increase conversions.</p>
  `;

  // If "New document" dispatched a single space, it's truthy and stays blank here.
  const [title, setTitle] = useState(data?.title || "Content Editor : AI in education");
  const [content, setContent] = useState(data?.content || DEFAULT_CONTENT);

  const [activeTab, setActiveTab] = useState("content");
  const [seoMode, setSeoMode] = useState("basic");
  const [lastEdited, setLastEdited] = useState("1 day ago");
  const [query, setQuery] = useState("");

  const [metrics, setMetrics] = useState({
    plagiarism: 0,
    primaryKeyword: 0,
    wordCount: 0,
    wordTarget: 1480,
    lsiKeywords: 0,
  });

  // Apply payload when opening from Dashboard card or New doc
  useEffect(() => {
    if (!data) return;
    if (data.title) setTitle(data.title);
    if (typeof data.content === "string") setContent(data.content);
  }, [data]);

  // Recompute metrics whenever content changes
  useEffect(() => {
    // NEW: if the doc is blank, force zeros so nothing shows 100%
    if (isBlankHtml(content)) {
      setMetrics({
        plagiarism: 0,
        primaryKeyword: 0,
        wordCount: 0,
        wordTarget: 1480,
        lsiKeywords: 0,
      });
      return;
    }

    const text = htmlToText(content).toLowerCase();
    const words = text.match(/[a-z0-9']+/gi) || [];
    const wordCount = words.length;

    // Primary keyword score — best near ~1.3% density
    const pkEsc = PRIMARY_KEYWORD.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const pkOcc = (text.match(new RegExp(`\\b${pkEsc}\\b`, "gi")) || []).length;
    const density = pkOcc / Math.max(1, wordCount); // 0..1
    const ideal = 0.013;
    const pkScore = clamp(100 - (Math.abs(density - ideal) / ideal) * 100);

    // LSI coverage
    const lsiHits = LSI.filter((k) => text.includes(k)).length;
    const lsiPct = clamp((lsiHits / Math.max(1, LSI.length)) * 100);

    // Simulated plagiarism
    const uniqueWords = new Set(words).size;
    const uniqueness = uniqueWords / Math.max(1, wordCount);
    const plag = clamp((1 - uniqueness) * 120);

    setMetrics({
      plagiarism: Math.round(plag),
      primaryKeyword: Math.round(pkScore),
      wordCount,
      wordTarget: 1480,
      lsiKeywords: Math.round(lsiPct),
    });
  }, [content, PRIMARY_KEYWORD, LSI]);

  return (
    <div className="min-h-screen">
      <main className="bg-[var(--bg-panel)] px-2 py-6 sm:px-3 lg:px-4 xl:px-5">
        <CENavbar title={title} onBack={onBackToDashboard} onTitleChange={setTitle} />

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
          onStart={() => {}}
          /** pass-through so Research Panel reacts to pills + shows live chips */
          seoMode={seoMode}
          metrics={metrics}
          content={content}
          setContent={(html) => {
            setContent(html);
            setLastEdited("a few seconds ago");
          }}
        />
      </main>
    </div>
  );
}
