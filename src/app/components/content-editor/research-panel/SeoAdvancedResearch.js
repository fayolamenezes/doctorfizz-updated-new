"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Sparkles, Plus, MoreHorizontal } from "lucide-react";

/* UI atoms (theme-aware) */
function Chip({ children }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-[var(--border)] bg-[var(--bg-panel)] px-2 py-0.5 text-[11px] text-[var(--text-primary)] transition-colors">
      {children}
    </span>
  );
}

function HBadge({ level = "H1" }) {
  const color =
    level === "H1"
      ? "bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-700"
      : level === "H2"
      ? "bg-violet-50 dark:bg-violet-950/30 text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-700"
      : "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-700";
  return (
    <span
      className={`grid h-7 w-7 place-items-center rounded-md border text-[11px] font-semibold ${color} transition-colors`}
      title={level}
    >
      {String(level).replace("H", "")}
    </span>
  );
}

function RowIconButton({ children, title }) {
  return (
    <button
      type="button"
      title={title}
      className="grid h-7 w-7 place-items-center rounded-md border border-[var(--border)] bg-[var(--bg-panel)] text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors"
    >
      {children}
    </button>
  );
}

function OutlineRow({ level = "H2", title, onPaste, onAddInstruction }) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-panel)] transition-colors">
      <div className="flex items-center justify-between gap-3 px-3 py-2.5">
        <div className="flex min-w-0 items-center gap-3">
          <HBadge level={level} />
          <div className="min-w-0">
            <div className="truncate text-[13px] font-medium text-[var(--text-primary)]">
              {title}
            </div>
            <button
              type="button"
              onClick={onAddInstruction}
              className="mt-0.5 inline-flex items-center gap-1 text-[11px] text-[var(--muted)] hover:underline"
            >
              + Add Instruction
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Paste button with hover tooltip */}
          <div className="relative group">
            <button
              type="button"
              onClick={onPaste}
              aria-label="Paste to editor"
              className="grid place-items-center h-7 w-7 rounded-md border border-[var(--border)] bg-[var(--bg-panel)] text-[var(--text-primary)] shadow-sm hover:bg-[var(--bg-hover)] focus:outline-none transition-colors"
            >
              <Image src="/assets/copy.svg" width={12} height={12} alt="Paste" />
            </button>
            <span className="pointer-events-none absolute -top-7 right-0 rounded-md border border-[var(--border)] bg-[var(--bg-panel)] px-2 py-0.5 text-[10px] font-medium text-[var(--text-primary)] shadow-sm opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-100 whitespace-nowrap">
              Paste to editor
            </span>
          </div>

          <RowIconButton title="More">
            <MoreHorizontal size={14} className="text-[var(--muted)]" />
          </RowIconButton>
        </div>
      </div>
    </div>
  );
}

/* extract headings */
function extractHeadingsFromHTML(html) {
  try {
    if (!html || typeof window === "undefined") return [];
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const tags = ["h1", "h2", "h3"];
    const out = [];
    tags.forEach((tag) => {
      doc.querySelectorAll(tag).forEach((node) => {
        const text = (node.textContent || "").trim();
        if (text) out.push({ level: tag.toUpperCase(), title: text });
      });
    });
    return out;
  } catch {
    return [];
  }
}

export default function SeoAdvancedResearch({ editorContent, onPasteToEditor }) {
  const [tab, setTab] = useState("outline"); // outline | competitors | heatmaps
  const [outline, setOutline] = useState([
    { level: "H1", title: "Content marketing strategies for SAAS." },
    { level: "H2", title: "Understanding SaaS Content Marketing" },
    { level: "H2", title: "Identifying Target Audiences" },
    { level: "H3", title: "Constructing Detailed Audience Personas" },
  ]);

  useEffect(() => {
    const ex = extractHeadingsFromHTML(editorContent);
    if (ex.length) setOutline(ex);
  }, [editorContent]);

  return (
    <div className="mt-1 rounded-2xl border border-[var(--border)] bg-[var(--bg-panel)] p-3 transition-colors">
      <div className="flex items-center justify-between gap-3">
        {/* Tabs */}
        <div className="flex items-center gap-6 border-b border-[var(--border)] px-1 transition-colors">
          <button
            onClick={() => setTab("outline")}
            className={`px-2 pb-2 text-[12px] font-semibold transition-all ${
              tab === "outline"
                ? "text-[var(--text-primary)] border-b-2 border-amber-400"
                : "text-[var(--muted)] hover:text-[var(--text-primary)]"
            }`}
          >
            Outline
          </button>
          <button
            onClick={() => setTab("competitors")}
            className={`px-2 pb-2 text-[12px] font-semibold transition-all ${
              tab === "competitors"
                ? "text-[var(--text-primary)] border-b-2 border-amber-400"
                : "text-[var(--muted)] hover:text-[var(--text-primary)]"
            }`}
          >
            Competitor’s
          </button>
          <button
            onClick={() => setTab("heatmaps")}
            className={`px-2 pb-2 text-[12px] font-semibold transition-all ${
              tab === "heatmaps"
                ? "text-[var(--text-primary)] border-b-2 border-amber-400"
                : "text-[var(--muted)] hover:text-[var(--text-primary)]"
            }`}
          >
            Heatmap’s
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Chip>28 Headings</Chip>
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded-md border border-[var(--border)] bg-[var(--bg-panel)] px-2.5 py-1.5 text-[12px] font-medium text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors"
          >
            <Sparkles size={14} /> AI Headings
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded-md border border-amber-200 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/30 px-2.5 py-1.5 text-[12px] font-semibold text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/30 transition-colors"
          >
            <Plus size={14} /> Generate article
          </button>
        </div>
      </div>

      {/* Content by tab */}
      {tab === "outline" && (
        <div className="mt-3 space-y-2">
          {outline.map((h, i) => (
            <OutlineRow
              key={i}
              level={h.level}
              title={h.title}
              onPaste={() => onPasteToEditor?.(h.title)}
              onAddInstruction={() => onPasteToEditor?.(`Add instruction for: ${h.title}`)}
            />
          ))}
        </div>
      )}

      {tab === "competitors" && (
        <div className="mt-4 grid place-items-center rounded-xl border border-dashed border-[var(--border)] py-10 text-[var(--muted)] text-[12px] transition-colors">
          Competitor mapping view — wire data here.
        </div>
      )}

      {tab === "heatmaps" && (
        <div className="mt-4 grid place-items-center rounded-xl border border-dashed border-[var(--border)] py-10 text-[var(--muted)] text-[12px] transition-colors">
          Heatmap of headings vs. SERP frequency — wire data here.
        </div>
      )}
    </div>
  );
}
