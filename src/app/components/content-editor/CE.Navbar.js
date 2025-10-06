"use client";

import React from "react";
import { ArrowLeft, Edit3, MoonStar, Sparkles } from "lucide-react";

export default function CENavbar({ title, onBack, onTitleChange }) {
  return (
    <header className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <button
          onClick={() => onBack?.()}
          className="inline-flex items-center gap-2 rounded-lg border border-[var(--border)] px-3 py-2 text-sm text-[var(--muted)] hover:bg-[var(--input)] transition"
        >
          <ArrowLeft size={16} /> Back to DASHBOARD
        </button>
        <h1 className="text-[18px] font-semibold">
          Content Editor : <span className="text-[var(--muted)]">{title}</span>
        </h1>
        <button
          className="p-1 rounded hover:bg-[var(--input)] text-[var(--muted)]"
          title="Rename"
          onClick={() => {
            const next = prompt("Rename document", title);
            if (next != null) onTitleChange?.(next || "Untitled");
          }}
        >
          <Edit3 size={16} />
        </button>
      </div>

      <div className="flex items-center gap-2">
        <button className="inline-flex items-center gap-2 rounded-[14px] px-4 py-2 text-[13px] font-semibold text-white shadow-sm bg-[image:var(--infoHighlight-gradient)]">
          <Sparkles size={16} /> Chat with AI
        </button>
        <button className="h-9 w-9 grid place-items-center rounded-full bg-orange-200/60 text-orange-700">
          <MoonStar size={18} />
        </button>
      </div>
    </header>
  );
}