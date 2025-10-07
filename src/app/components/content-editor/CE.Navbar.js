"use client";

import React from "react";
import { ArrowLeft, Edit3, Sparkles, Plus } from "lucide-react";

export default function CENavbar({
  title,
  onBack,
  onTitleChange,
  searchVolume,
  keywordDifficulty,
}) {
  const sv = searchVolume ?? "-----";
  const kd = keywordDifficulty ?? "-----";

  const handleNewDoc = () => {
    window.dispatchEvent(new CustomEvent("content-editor:open", { detail: null }));
  };

  return (
    <header className="mb-4 pr-16 md:pr-20">
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

        {/* BOTTOM-CENTER: inline metrics */}
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

        {/* TOP-RIGHT: New Document + Chat with AI */}
        <div className="col-start-3 row-start-1 flex items-center gap-3">
          {/* New Document */}
          <button
            onClick={handleNewDoc}
            className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-[13px] font-semibold text-[var(--accent)] border border-[var(--accent)] hover:bg-[var(--accent)]/10 transition"
          >
            <Plus size={16} />
            <span>New document</span>
          </button>

          {/* Chat with AI pill */}
          <button className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-[13px] font-semibold text-white shadow-sm bg-[image:var(--infoHighlight-gradient)] hover:opacity-90 transition">
            <span>Chat with Ai</span>
            <Sparkles size={16} />
          </button>
        </div>
      </div>
    </header>
  );
}
