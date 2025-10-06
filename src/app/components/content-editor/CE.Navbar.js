"use client";

import React from "react";
import { ArrowLeft, Edit3, Sparkles } from "lucide-react";

export default function CENavbar({
  title,
  onBack,
  onTitleChange,
  searchVolume,
  keywordDifficulty,
}) {
  const sv = searchVolume ?? "-----";
  const kd = keywordDifficulty ?? "-----";

  return (
    // add right padding so your existing toggle doesn't overlap the pill
    <header className="mb-4 pr-16 md:pr-20">
      {/* 3 columns, 2 rows: 
          row 1 -> back (left) + chat (right)
          row 2 -> title (left) + metrics (center) */}
      <div className="grid grid-cols-[auto_1fr_auto] grid-rows-[auto_auto] items-center gap-x-4">
        {/* TOP-LEFT: small back link */}
        <div className="col-start-1 row-start-1">
          <button
            onClick={() => onBack?.()}
            className="inline-flex items-center gap-2 px-0 py-0 text-[12px] text-[var(--muted)] hover:opacity-70 transition"
          >
            <ArrowLeft size={16} />
            <span className="font-medium">Back to DASHBOARD</span>
          </button>
        </div>

        {/* BOTTOM-LEFT: title + pencil */}
        <div className="col-start-1 row-start-2 flex items-baseline gap-1 min-w-0">
          <h1 className="text-[16px] md:text-[18px] font-semibold leading-none truncate">
            Content Editor :{" "}
            <span className="text-[var(--muted)]">{title}</span>
          </h1>
          <button
            title="Rename"
            onClick={() => {
              const next = prompt("Rename document", title);
              if (next != null) onTitleChange?.(next || "Untitled");
            }}
            className="p-1 rounded text-[var(--muted)] hover:bg-[var(--input)]"
          >
            <Edit3 size={16} />
          </button>
        </div>

        {/* BOTTOM-CENTER: muted inline metrics (hidden on small) */}
        <div className="col-start-2 row-start-2 hidden md:flex items-center justify-center">
          <div className="flex items-center gap-12 text-[12px] text-[var(--muted)]">
            <span>
              Search Volume : <span className="opacity-60">{sv}</span>
            </span>
            <span>
              Keyword difficulty : <span className="opacity-60">{kd}</span>
            </span>
          </div>
        </div>

        {/* TOP-RIGHT: Chat with AI pill */}
        <div className="col-start-3 row-start-1 flex items-center gap-2">
          <button className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-[13px] font-semibold text-white shadow-sm bg-[image:var(--infoHighlight-gradient)] hover:opacity-90 transition">
            <span>Chat with Ai</span>
            <Sparkles size={16} />
          </button>
        </div>
      </div>
    </header>
  );
}
