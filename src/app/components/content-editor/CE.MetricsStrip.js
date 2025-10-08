"use client";

import React, { useEffect, useRef, useState } from "react";
import { HelpCircle, MinusCircle, PlusCircle, ListChecks } from "lucide-react";

/** Tiny spring for micro-animations (easeOutCubic). */
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

function Bar({ pct = 0, tone = "default" }) {
  const width = Math.max(0, Math.min(100, pct));
  const color =
    tone === "warn"
      ? "#F59E0B"
      : tone === "good"
      ? "#1CC88A"
      : tone === "bad"
      ? "#EF4444"
      : "#7C8AA0";
  return (
    <div className="mt-1 h-1.5 rounded bg-gray-200 overflow-hidden">
      <div className="h-full rounded" style={{ width: `${width}%`, backgroundColor: color }} />
    </div>
  );
}

function MetricCard({ label, valuePct, rightText, tone = "default" }) {
  const anim = useSpringNumber(valuePct ?? 0);
  return (
    <div className="min-w-0 h-[64px] rounded-[12px] border border-[var(--border)] bg-white/70 px-3 py-2">
      <div className="flex items-center gap-1 text-[12px] font-semibold tracking-wide text-[var(--text-primary)]">
        <span className="truncate">{label}</span>
        <HelpCircle size={14} className="text-[var(--muted)] shrink-0" />
      </div>
      <div className="mt-1 flex items-center justify-between">
        <div className="text-[12px] leading-none text-[var(--text-primary)]">
          {pctText(anim)}
        </div>
        <div className="text-[11px] text-[var(--muted)] opacity-70">{rightText}</div>
      </div>
      <Bar pct={anim} tone={tone} />
    </div>
  );
}

function WordcountCard({ count = 0, target = 1200 }) {
  const pct = Math.max(0, Math.min(100, (count / Math.max(1, target)) * 100));
  const animPct = useSpringNumber(pct);
  const animCount = useSpringNumber(count);
  const tone = pct < 40 ? "warn" : "good";

  return (
    <div className="min-w-0 h-[64px] rounded-[12px] border border-[var(--border)] bg-white/70 px-3 py-2">
      <div className="flex items-center gap-1 text-[12px] font-semibold tracking-wide text-[var(--text-primary)]">
        <span className="truncate">WORD COUNT</span>
        <HelpCircle size={14} className="text-[var(--muted)] shrink-0" />
      </div>
      <div className="mt-1 flex items-center justify-between">
        <div className="text-[12px] leading-none text-[var(--text-primary)] tabular-nums">
          {Math.round(animCount).toLocaleString()} / {target.toLocaleString()}
        </div>
        <div className="text-[11px] text-[var(--muted)] opacity-70">{pctText(animPct)}</div>
      </div>
      <Bar pct={animPct} tone={tone} />
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
  const plagPct = metrics?.plagiarism ?? 0;
  const pkPct = metrics?.primaryKeyword ?? 0;
  const wc = metrics?.wordCount ?? 0;
  const wcTarget = metrics?.wordTarget ?? 1200;
  const lsiPct = metrics?.lsiKeywords ?? 0;

  return (
    <div className="mb-4">
      <div className="grid grid-cols-[1.2fr_1.2fr_1.2fr_1.2fr_.8fr_.8fr_.8fr] gap-3 items-stretch">
        <MetricCard label="PLAGIARISM" valuePct={plagPct} rightText="Need Review" tone="warn" />
        <MetricCard label="PRIMARY KEYWORD" valuePct={pkPct} rightText="Good" tone="good" />
        <WordcountCard count={wc} target={wcTarget} />
        <MetricCard label="LSI KEYWORDS" valuePct={lsiPct} rightText="Moderate" />

        <SeoPill title="Basic"   Icon={MinusCircle} active={seoMode === "basic"}   onClick={() => onChangeSeoMode?.("basic")} />
        <SeoPill title="Advanced" Icon={PlusCircle} active={seoMode === "advanced"} onClick={() => onChangeSeoMode?.("advanced")} />
        <SeoPill title="Details" Icon={ListChecks}  active={seoMode === "details"} onClick={() => onChangeSeoMode?.("details")} />
      </div>
    </div>
  );
}
