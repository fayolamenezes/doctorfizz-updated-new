"use client";

import React from "react";

function MetricCard({ label, value, loading=true }) {
  return (
    <div className="rounded-[12px] border border-[var(--border)] bg-white/70 p-3 shadow-[0_1px_0_rgba(0,0,0,0.02)]">
      <div className="flex items-center justify-between text-[12px] text-[var(--muted)]">
        <span>{label}</span>
        <span>{loading ? "Loading" : ""}</span>
      </div>
      <div className="mt-1 h-1.5 rounded bg-gray-200 overflow-hidden">
        <div className="h-full w-[20%] bg-gray-600/60" />
      </div>
    </div>
  );
}

export default function CEMetricsStrip({ metrics, seoMode, onChangeSeoMode }) {
  const ModePill = ({ id, children }) => {
    const active = seoMode === id;
    return (
      <button
        onClick={() => onChangeSeoMode?.(id)}
        className={`rounded-[12px] border px-4 py-2 text-[13px] font-semibold ${
          active
            ? "border-orange-400 bg-orange-50 text-orange-700"
            : "border-[var(--border)] bg-white/70 text-[var(--muted)] hover:bg-[var(--input)]"
        }`}
      >
        {children}
      </button>
    );
  };

  return (
    <div className="mb-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <MetricCard label="PLAGIARISM" />
        <MetricCard label="PRIMARY KEYWORD" />
        <MetricCard label="WORD COUNT" />
        <MetricCard label="LSI KEYWORDS" />
      </div>
      <div className="mt-3 flex items-center gap-2">
        <ModePill id="basic">SEO <span className="ml-1">Basic</span></ModePill>
        <ModePill id="advance">SEO <span className="ml-1">Advance</span></ModePill>
        <ModePill id="details">SEO <span className="ml-1">Details</span></ModePill>
      </div>
    </div>
  );
}