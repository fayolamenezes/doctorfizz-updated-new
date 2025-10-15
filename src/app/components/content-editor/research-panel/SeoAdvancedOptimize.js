"use client";

import React, { useMemo, useState } from "react";
import { ArrowUpRight, ArrowDownRight, ChevronRight, X, Search as SearchIcon } from "lucide-react";

/* helpers */
function IconHintButton({ onClick, label = "Paste to editor", size = 12, className = "" }) {
  return (
    <div className={`relative group ${className}`}>
      <button type="button" onClick={onClick} aria-label={label} className="grid place-items-center h-7 w-7 rounded-md border border-gray-200 bg-white/90 text-gray-600 shadow-sm hover:bg-gray-50 focus:outline-none">
        <div style={{ width: size, height: size }} className="relative">
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[2px] bg-gray-600" />
          <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[2px] bg-gray-600" />
        </div>
      </button>
      <span className="pointer-events-none absolute -top-7 right-0 rounded-md border border-gray-200 bg-white px-2 py-0.5 text-[10px] font-medium text-gray-700 shadow-sm opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-75 whitespace-nowrap">
        {label}
      </span>
    </div>
  );
}

function KPI({ label, value, delta, up }) {
  const Icon = up ? ArrowUpRight : ArrowDownRight;
  const tone = up ? "text-emerald-600" : "text-rose-600";
  return (
    <div className="flex-1 rounded-xl border border-gray-200 bg-white px-3 py-2">
      <div className="text-[10px] text-gray-500">{label}</div>
      <div className="mt-1 flex items-center gap-2">
        <div className="text-[16px] font-semibold text-gray-800">{value}</div>
        <span className={`inline-flex items-center gap-0.5 text-[10px] ${tone}`}>
          <Icon size={13} />
          {delta}
        </span>
      </div>
    </div>
  );
}

function FilterBar({ kw, onKw, tail, onTail, status, onStatus }) {
  return (
    <div className="mt-3 flex items-center gap-2">
      <div className="relative flex-1">
        <input
          value={kw}
          onChange={(e) => onKw(e.target.value)}
          placeholder="Filter by keywords"
          className="w-full h-9 rounded-lg border border-gray-200 bg-white px-8 text-[12px] outline-none focus:border-blue-300"
        />
        <SearchIcon size={13} className="absolute left-2.5 top-2.5 text-gray-400" />
      </div>
      <select value={tail} onChange={(e) => onTail(e.target.value)} className="h-9 rounded-lg border border-gray-200 bg-white px-2 text-[11px] text-gray-700">
        <option>Long tail</option><option>Short tail</option><option>Exact</option>
      </select>
      <select value={status} onChange={(e) => onStatus(e.target.value)} className="h-9 rounded-lg border border-gray-200 bg-white px-2 text-[11px] text-gray-700">
        <option>All Status</option><option>Good</option><option>Needs Fix</option>
      </select>
    </div>
  );
}

function ScoreCard({ title, badge, progress, source, tone = "green", onOpen, onPaste }) {
  const toneMap = { green: "bg-emerald-50 text-emerald-700 border-emerald-200", amber: "bg-amber-50 text-amber-700 border-amber-200", gray: "bg-gray-100 text-gray-700 border-gray-200" };
  const barMap = { green: "bg-emerald-500", amber: "bg-amber-500", gray: "bg-gray-300" };
  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <button onClick={onOpen} className="w-full px-3.5 py-3 flex items-start gap-3">
        <span className={`text-[10px] px-2 py-0.5 border rounded-full font-semibold ${toneMap[tone]}`}>{badge}</span>
        <div className="min-w-0 flex-1 text-left">
          <div className="flex items-center gap-2">
            <div className="text-[13px] font-semibold text-gray-800">{title}</div>
            <span className="text-[10px] text-gray-500">Source: {source}</span>
          </div>
          <div className="mt-2 h-1.5 w-full rounded-full bg-gray-100">
            <div className={`h-1.5 rounded-full ${barMap[tone]}`} style={{ width: `${progress}%` }} />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <IconHintButton onClick={(e) => { e.stopPropagation(); onPaste?.(); }} />
          <ChevronRight size={18} className="text-gray-400" />
        </div>
      </button>
    </div>
  );
}

function DrawerHeader({ title, onClose, countText }) {
  return (
    <div className="flex items-start justify-between">
      <div>
        <div className="text-[13px] font-semibold text-gray-800">{title}</div>
        {countText ? <div className="text-[11px] text-gray-500 mt-0.5">{countText}</div> : null}
      </div>
      <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={16} /></button>
    </div>
  );
}

function StatTriplet({ mine, avg, results }) {
  return (
    <div className="mt-3 grid grid-cols-3 gap-2">
      {[[ "MY MENTION", mine ],[ "AVG. MENTIONS", avg ],[ "SEARCH RESULTS", results ]].map(([label,value]) => (
        <div key={label} className="rounded-xl border border-gray-200 bg-white px-3 py-2">
          <div className="text-[10px] text-gray-500">{label}</div>
          <div className="text-[16px] font-semibold text-gray-800 mt-0.5">{value}</div>
        </div>
      ))}
    </div>
  );
}

function SourceCard({ url, title, snippet }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`rounded-xl border ${open ? "border-amber-200 bg-amber-50" : "border-gray-200 bg-white"} shadow-sm`}>
      <button onClick={() => setOpen((s) => !s)} className="w-full px-3.5 py-3 text-left">
        <div className="text-[11px] text-gray-500 truncate">{url}</div>
        <div className="mt-1 flex items-center justify-between gap-2">
          <div className="text-[13px] font-medium text-gray-800 truncate">{title}</div>
          <ChevronRight size={16} className={`text-gray-400 transition-transform ${open ? "rotate-90" : ""}`} />
        </div>
      </button>
      {open && (<div className="px-3.5 pb-3 -mt-1 text-[12px] text-gray-600"><p className="leading-6">{snippet ?? "…"}</p></div>)}
    </div>
  );
}

export default function SeoAdvancedOptimize({ onPasteToEditor }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [kwFilter, setKwFilter] = useState("");
  const [tailType, setTailType] = useState("Long tail");
  const [statusFilter, setStatusFilter] = useState("All Status");

  const cards = useMemo(() => [
    { title: "Content Marketing", badge: "4/3", progress: 92, source: 15, tone: "green" },
    { title: "Strategies", badge: "2/4", progress: 58, source: 5, tone: "amber" },
    { title: "Link Readability", badge: "1/3", progress: 35, source: 15, tone: "gray" },
    { title: "Title Readability", badge: "3/3", progress: 90, source: 15, tone: "green" },
  ], []);

  return (
    <>
      {!drawerOpen && (
        <>
          <div className="mt-2 grid grid-cols-3 gap-2">
            <KPI label="HEADINGS" value={2} delta={29} up={false} />
            <KPI label="LINKS" value={5} delta={1} up={false} />
            <KPI label="IMAGES" value={3} delta={1} up={true} />
          </div>

          <FilterBar kw={kwFilter} onKw={setKwFilter} tail={tailType} onTail={setTailType} status={statusFilter} onStatus={setStatusFilter} />

          <div className="mt-3 space-y-2">
            {cards.map((c, i) => (
              <ScoreCard
                key={i}
                title={c.title}
                badge={c.badge}
                progress={c.progress}
                source={c.source}
                tone={c.tone}
                onOpen={() => setDrawerOpen(true)}
                onPaste={() => onPasteToEditor?.(c.title)}
              />
            ))}
          </div>
        </>
      )}

      {drawerOpen && (
        <div className="mt-1 rounded-2xl border border-gray-200 bg-white p-3">
          <DrawerHeader title="Title Readability" countText="15 Search result mention this topic" onClose={() => setDrawerOpen(false)} />
          <StatTriplet mine={2} avg={5} results={3} />
          <div className="mt-3 space-y-2">
            <SourceCard url="https://www.greenleafinsights.com" title="How to start a blog in 10 steps: a beginner’s guide" />
            <SourceCard url="https://www.greenleafinsights.com" title="How to Launch a Blog in 10 Easy Steps" />
            <SourceCard url="https://www.greenleafinsights.com" title="Blogging Made Simple" />
            <SourceCard url="https://www.greenleafinsights.com" title="10 Steps to Starting a Blog" />
          </div>
        </div>
      )}
    </>
  );
}