"use client";

import React from "react";
import { HelpCircle, MinusCircle, PlusCircle, ListChecks } from "lucide-react";

function MetricCard({ label, loading = true }) {
  return (
    <div className="min-w-0 h-[64px] rounded-[12px] border border-[var(--border)] bg-white/70 px-3 py-2">
      {/* Label + help icon (top-left) */}
      <div className="flex items-center gap-1 text-[12px] font-semibold tracking-wide text-[var(--text-primary)]">
        <span className="truncate">{label}</span>
        <HelpCircle size={14} className="text-[var(--muted)] shrink-0" />
      </div>

      {/* Metric value (left) + Loading (right) — both ABOVE the progress bar */}
      <div className="mt-1 flex items-center justify-between">
        <div className="text-[12px] leading-none text-[var(--text-primary)]">---%</div>
        <div className="text-[11px] text-[var(--muted)] opacity-70">
          {loading ? "Loading" : ""}
        </div>
      </div>

      {/* Progress bar at the bottom */}
      <div className="mt-1 h-1 rounded bg-gray-200 overflow-hidden">
        <div className="h-full w-[18%] rounded bg-gray-600/60" />
      </div>
    </div>
  );
}

function SeoPill({ active, title, Icon, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`min-w-0 h-[60px] rounded-[12px] border px-2.5 text-left ${
        active
          ? "border-orange-300 bg-orange-50"
          : "border-[var(--border)] bg-white/70 hover:bg-[var(--input)]"
      }`}
    >
      <div className="flex items-center gap-2">
        <span
          className={`grid place-items-center h-6 w-6 rounded-full border ${
            active ? "border-orange-300 bg-orange-100" : "border-gray-300 bg-gray-100"
          }`}
        >
          <Icon size={16} className={active ? "text-orange-600" : "text-gray-500"} />
        </span>
        <div className="leading-tight min-w-0">
          <div className={`text-[10px] ${active ? "text-orange-700/80" : "text-[var(--muted)]"}`}>
            SEO
          </div>
          <div
            className={`text-[12px] font-semibold truncate ${
              active ? "text-orange-700" : "text-[var(--muted)]"
            }`}
          >
            {title}
          </div>
        </div>
      </div>
    </button>
  );
}

export default function CEMetricsStrip({ metrics, seoMode, onChangeSeoMode }) {
  return (
    <div className="mb-4">
      {/* 4 wider metric cards + 3 slimmer SEO pills (single row) */}
      <div className="grid grid-cols-[1.2fr_1.2fr_1.2fr_1.2fr_.8fr_.8fr_.8fr] gap-3 items-stretch">
        <MetricCard label="PLAGIARISM" />
        <MetricCard label="PRIMARY KEYWORD" />
        <MetricCard label="WORD COUNT" />
        <MetricCard label="LSI KEYWORDS" />

        <SeoPill
          title="Basic"
          Icon={MinusCircle}
          active={seoMode === "basic"}
          onClick={() => onChangeSeoMode?.("basic")}
        />
        <SeoPill
          title="Advance"
          Icon={PlusCircle}
          active={seoMode === "advance"}
          onClick={() => onChangeSeoMode?.("advance")}
        />
        <SeoPill
          title="Details"
          Icon={ListChecks}
          active={seoMode === "details"}
          onClick={() => onChangeSeoMode?.("details")}
        />
      </div>
    </div>
  );
}
