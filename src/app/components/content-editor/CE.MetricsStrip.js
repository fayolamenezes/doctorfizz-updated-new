"use client";

import React, { useEffect, useRef, useState } from "react";
import { HelpCircle, MinusCircle, PlusCircle, ListChecks } from "lucide-react";

/** Smooth animation hook for number transitions */
function useSpringNumber(target = 0, ms = 700) {
  const [value, setValue] = useState(target);
  const prevTarget = useRef(target);
  const raf = useRef();

  useEffect(() => {
    if (target === prevTarget.current) return;
    prevTarget.current = target;

    cancelAnimationFrame(raf.current);
    const from = value;
    const to = Number.isFinite(target) ? target : 0;
    const start = performance.now();

    const tick = (now) => {
      const t = Math.min(1, (now - start) / ms);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(from + (to - from) * eased);
      if (t < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [target]); // eslint-disable-line react-hooks/exhaustive-deps

  return value;
}

const pctText = (n, digits = 0) =>
  `${Math.max(0, Math.min(100, n || 0)).toFixed(digits)}%`;

function getStatus(pct) {
  if (pct >= 75) return { label: "Good", color: "text-green-600" };
  if (pct >= 40) return { label: "Moderate", color: "text-yellow-600" };
  return { label: "Needs Review", color: "text-red-600" };
}

/** progress bar */
function Bar({ pct = 0, tone = "default", className = "" }) {
  const width = Math.max(0, Math.min(100, pct));
  const color =
    tone === "warn"
      ? "#F59E0B"
      : tone === "good"
      ? "#16A34A"
      : tone === "bad"
      ? "#DC2626"
      : "#CBD5E1";
  return (
    <div className={`mt-1 h-1.5 rounded bg-gray-200 overflow-hidden ${className}`}>
      <div
        className="h-full rounded transition-all duration-500"
        style={{ width: `${width}%`, backgroundColor: color }}
      />
    </div>
  );
}

/** Generic metric card (Plagiarism, Primary Keyword) */
function MetricCard({ label, valuePct }) {
  const anim = useSpringNumber(valuePct ?? 0);
  const status = getStatus(valuePct);
  const tone =
    status.label === "Good" ? "good" : status.label === "Moderate" ? "warn" : "bad";

  return (
    <div className="relative min-w-0 h-[74px] rounded-[12px] border border-[var(--border)] bg-white/70 px-3 py-2">
      <div className="flex h-full flex-col justify-end">
        <div className="mb-1 flex items-center gap-1 text-[11px] font-semibold tracking-wide text-[var(--text-primary)]">
          <span className="truncate">{label}</span>
          <HelpCircle size={13} className="text-[var(--muted)] shrink-0" />
        </div>

        <div className="mb-1 flex items-center justify-between">
          <div className="text-[14px] font-bold text-[var(--text-primary)]">
            {pctText(anim)}
          </div>
          <div className={`text-[11px] ${status.color} font-medium`}>
            {status.label}
          </div>
        </div>

        <Bar pct={anim} tone={tone} />
      </div>
    </div>
  );
}

/** Word count card (left: 400 / 1480, right: 60%) */
function WordcountCard({ count = 0, target = 1200 }) {
  const pct = Math.max(0, Math.min(100, (count / Math.max(1, target)) * 100));
  const animPct = useSpringNumber(pct);
  const animCount = useSpringNumber(count);
  const tone = pct >= 75 ? "good" : pct >= 40 ? "warn" : "bad";

  return (
    <div className="min-w-0 h-[74px] rounded-[12px] border border-[var(--border)] bg-white/70 px-3 py-2">
      <div className="flex h-full flex-col justify-end">
        <div className="mb-1 flex items-center gap-1 text-[11px] font-semibold tracking-wide text-[var(--text-primary)]">
          <span className="truncate">WORD COUNT</span>
          <HelpCircle size={13} className="text-[var(--muted)] shrink-0" />
        </div>

        <div className="mb-1 flex items-center justify-between">
          <div className="text-[14px] font-bold text-[var(--text-primary)] tabular-nums">
            {Math.round(animCount)} <span className="font-normal">/ {target}</span>
          </div>
          <div className="text-[11.5px] font-semibold text-[var(--muted)] opacity-70">
            {pctText(animPct)}
          </div>
        </div>

        <Bar pct={animPct} tone={tone} />
      </div>
    </div>
  );
}

/** LSI keywords card — shows "Coverage: xx%" at left (no upgrade chip) */
function LsiCoverageCard({ valuePct = 0 }) {
  const anim = useSpringNumber(valuePct);
  const status = getStatus(valuePct);
  const tone =
    status.label === "Good" ? "good" : status.label === "Moderate" ? "warn" : "bad";

  return (
    <div className="relative min-w-0 h-[74px] rounded-[12px] border border-[var(--border)] bg-white/70 px-3 py-2">
      <div className="flex h-full flex-col justify-end">
        <div className="mb-1 flex items-center gap-1 text-[11px] font-semibold tracking-wide text-[var(--text-primary)]">
          <span className="truncate">LSI KEYWORDS</span>
          <HelpCircle size={13} className="text-[var(--muted)] shrink-0" />
        </div>

        <div className="mb-1 flex items-center justify-between">
          <div className="text-[12px] font-semibold text-[var(--text-primary)]">
            Coverage: <span className="text-[13px] font-bold">{pctText(anim)}</span>
          </div>
          <div className={`text-[11px] ${status.color} font-medium`}>
            {status.label}
          </div>
        </div>

        <Bar pct={anim} tone={tone} />
      </div>
    </div>
  );
}

/** SEO pill (outlined; slightly smaller text so 'Advanced' fits) */
function SeoPill({ active, title, Icon, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`min-w-0 h-[74px] rounded-[12px] border px-3 text-left transition-all ${
        active
          ? "border-[1.5px] border-orange-600 bg-orange-50"
          : "border-gray-200 bg-white/70 hover:bg-[var(--input)]"
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
          <div
            className={`text-[10px] font-medium ${
              active ? "text-orange-700/80" : "text-[var(--muted)]"
            }`}
          >
            SEO
          </div>
          <div
            className={`text-[12.5px] font-bold truncate ${
              active ? "text-orange-700" : "text-[var(--muted)]"
            }`}
            title={title}
          >
            {title}
          </div>
        </div>
      </div>
    </button>
  );
}

/** MAIN */
export default function CEMetricsStrip({ metrics, seoMode, onChangeSeoMode }) {
  const plagPct = metrics?.plagiarism ?? 0;
  const pkPct = metrics?.primaryKeyword ?? 0;
  const wc = metrics?.wordCount ?? 0;
  const wcTarget = metrics?.wordTarget ?? 1200;
  const lsiPct = metrics?.lsiKeywords ?? 0;

  return (
    <div className="mb-4">
      {/* Slightly narrower first four; outlined SEO pills on the right */}
      <div className="grid grid-cols-[1.2fr_1.2fr_1.2fr_1.2fr_.8fr_.8fr_.8fr] gap-2.5 items-stretch">
        <MetricCard label="PLAGIARISM" valuePct={plagPct} />
        <MetricCard label="PRIMARY KEYWORD" valuePct={pkPct} />
        <WordcountCard count={wc} target={wcTarget} />
        <LsiCoverageCard valuePct={lsiPct} />

        <SeoPill
          title="Basic"
          Icon={MinusCircle}
          active={seoMode === "basic"}
          onClick={() => onChangeSeoMode?.("basic")}
        />
        <SeoPill
          title="Advanced"
          Icon={PlusCircle}
          active={seoMode === "advanced"}
          onClick={() => onChangeSeoMode?.("advanced")}
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
