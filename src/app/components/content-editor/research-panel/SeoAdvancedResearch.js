"use client";

import React, { useEffect, useState } from "react";
import { Sparkles, Plus, MoreHorizontal } from "lucide-react";

/* UI atoms from your file */
function Chip({ children }) {
  return <span className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white px-2 py-0.5 text-[11px] text-gray-700">{children}</span>;
}
function HBadge({ level = "H1" }) {
  const color = level === "H1" ? "bg-amber-50 text-amber-700 border-amber-200" : level === "H2" ? "bg-violet-50 text-violet-700 border-violet-200" : "bg-emerald-50 text-emerald-700 border-emerald-200";
  return <span className={`grid h-7 w-7 place-items-center rounded-md border text-[11px] font-semibold ${color}`}>{String(level).replace("H","")}</span>;
}
function RowIconButton({ children, title }) {
  return <button type="button" title={title} className="grid h-7 w-7 place-items-center rounded-md border border-gray-200 bg-white text-gray-600 hover:bg-gray-50">{children}</button>;
}
function OutlineRow({ level = "H2", title, onPaste, onAddInstruction }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white">
      <div className="flex items-center justify-between gap-3 px-3 py-2.5">
        <div className="flex min-w-0 items-center gap-3">
          <HBadge level={level} />
          <div className="min-w-0">
            <div className="truncate text-[13px] font-medium text-gray-800">{title}</div>
            <button
              type="button"
              onClick={onAddInstruction}
              className="mt-0.5 inline-flex items-center gap-1 text-[11px] text-gray-600 hover:underline"
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
              className="grid place-items-center h-7 w-7 rounded-md border border-gray-200 bg-white/90 text-gray-600 shadow-sm hover:bg-gray-50 focus:outline-none"
            >
              <img src="/assets/copy.svg" width={12} height={12} alt="Paste" />
            </button>
            <span className="pointer-events-none absolute -top-7 right-0 rounded-md border border-gray-200 bg-white px-2 py-0.5 text-[10px] font-medium text-gray-700 shadow-sm opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-75 whitespace-nowrap">
              Paste to editor
            </span>
          </div>

          <RowIconButton title="More">
            <MoreHorizontal size={14} />
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
    const tags = ["h1","h2","h3"];
    const out = [];
    tags.forEach(tag => {
      doc.querySelectorAll(tag).forEach(node => {
        const text = (node.textContent || "").trim();
        if (text) out.push({ level: tag.toUpperCase(), title: text });
      });
    });
    return out;
  } catch { return []; }
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
    <div className="mt-1 rounded-2xl border border-gray-200 bg-white p-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-6 border-b border-gray-100 px-1">
          <button onClick={() => setTab("outline")} className={`px-2 pb-2 text-[12px] font-semibold ${tab === "outline" ? "text-gray-900 border-b-2 border-gray-900" : "text-gray-500"}`}>Outline</button>
          <button onClick={() => setTab("competitors")} className={`px-2 pb-2 text-[12px] font-semibold ${tab === "competitors" ? "text-gray-900 border-b-2 border-gray-900" : "text-gray-500"}`}>Competitor’s</button>
          <button onClick={() => setTab("heatmaps")} className={`px-2 pb-2 text-[12px] font-semibold ${tab === "heatmaps" ? "text-gray-900 border-b-2 border-gray-900" : "text-gray-500"}`}>Heatmap’s</button>
        </div>
        <div className="flex items-center gap-2">
          <Chip>28 Headings</Chip>
          <button type="button" className="inline-flex items-center gap-1 rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-[12px] font-medium text-gray-800 hover:bg-gray-50">
            <Sparkles size={14} /> AI Headings
          </button>
          <button type="button" className="inline-flex items-center gap-1 rounded-md border border-amber-200 bg-amber-50 px-2.5 py-1.5 text-[12px] font-semibold text-amber-700 hover:bg-amber-50">
            <Plus size={14} /> Generate article
          </button>
        </div>
      </div>

      {tab === "outline" && (
        <div className="mt-3 space-y-2">
          {outline.map((h, i) => (
            <OutlineRow key={i} level={h.level} title={h.title} onPaste={() => onPasteToEditor?.(h.title)} onAddInstruction={() => onPasteToEditor?.(`Add instruction for: ${h.title}`)} />
          ))}
        </div>
      )}
      {tab === "competitors" && (
        <div className="mt-4 grid place-items-center rounded-xl border border-dashed border-gray-200 py-10 text-gray-500 text-[12px]">Competitor mapping view — wire data here.</div>
      )}
      {tab === "heatmaps" && (
        <div className="mt-4 grid place-items-center rounded-xl border border-dashed border-gray-200 py-10 text-gray-500 text-[12px]">Heatmap of headings vs. SERP frequency — wire data here.</div>
      )}
    </div> 
  );
}