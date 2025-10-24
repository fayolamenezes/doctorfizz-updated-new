"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Sparkles, Plus, MoreHorizontal } from "lucide-react";

/* ===============================
   UI atoms (theme-aware)
================================ */
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

function IconHintButton({ onClick, label = "Paste to editor", size = 12, className = "" }) {
  return (
    <div className={`relative group ${className}`}>
      <button
        type="button"
        onClick={onClick}
        aria-label={label}
        className="grid place-items-center h-8 w-8 rounded-md border border-[var(--border)] bg-white/90 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none
                   dark:bg-[var(--bg-panel)] dark:text-[var(--text-primary)] dark:hover:bg-[var(--bg-hover)]"
      >
        <Image src="/assets/copy.svg" width={size} height={size} alt="Paste" className="opacity-80" />
      </button>
      <span
        className="pointer-events-none absolute -top-7 right-0 rounded-md border border-[var(--border)] bg-white px-2 py-0.5 text-[10px] font-medium text-gray-700 shadow-sm opacity-0 transition-opacity duration-75 whitespace-nowrap
                   group-hover:opacity-100 group-focus-within:opacity-100
                   dark:bg-[var(--bg-panel)] dark:text-[var(--text-primary)]"
      >
        {label}
      </span>
    </div>
  );
}

/* ===============================
   Outline Row (indented like the reference)
================================ */
function OutlineRow({ level = "H2", title, onPaste, onAddInstruction }) {
  const indent =
    level === "H1" ? "pl-2" :
    level === "H2" ? "pl-6" :
    "pl-10"; // H3

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-panel)] hover:bg-[var(--bg-hover)] transition-colors">
      <div className={`flex items-center justify-between gap-3 px-3 py-2.5 ${indent}`}>
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
          <IconHintButton onClick={onPaste} />
          <RowIconButton title="More">
            <MoreHorizontal size={14} className="text-[var(--muted)]" />
          </RowIconButton>
        </div>
      </div>
    </div>
  );
}

/* ===============================
   Helpers
================================ */
function normalizePages(json) {
  if (!json) return [];
  // Accept either an array of pages, or an object with .pages
  if (Array.isArray(json)) return json;
  if (Array.isArray(json.pages)) return json.pages;
  return [json];
}

// Normalize to bare host (no protocol, lowercased, no leading www.)
function toHost(input = "") {
  try {
    const str = String(input).trim();
    if (!str) return "";
    const withProto = /^https?:\/\//i.test(str) ? str : `https://${str}`;
    const u = new URL(withProto);
    return u.hostname.replace(/^www\./i, "").toLowerCase();
  } catch {
    return String(input).replace(/^www\./i, "").toLowerCase();
  }
}

// Try to parse H1/H2/H3 from HTML (rare fallback only)
function extractHeadingsFromHTML(html) {
  try {
    if (!html || typeof window === "undefined") return [];
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const order = ["H1", "H2", "H3"];
    const out = [];
    order.forEach((tag) => {
      doc.querySelectorAll(tag.toLowerCase()).forEach((node) => {
        const text = (node.textContent || "").trim();
        if (text) out.push({ level: tag, title: text });
      });
    });
    return out;
  } catch {
    return [];
  }
}

// Safely get a page's domain host from multiple possible locations
function pageHost(p) {
  return toHost(
    p?.domain ||
      p?.details?.meta?.domain || // some files store it here
      p?.meta?.domain ||
      ""
  );
}

/* ===============================
   Component
================================ */
export default function SeoAdvancedResearch({
  editorContent,
  onPasteToEditor,
  /** If provided, we scope strictly to this domain/URL */
  domain,
  /** Visual height for the outline list */
  maxListHeight = "30rem",
}) {
  const [tab, setTab] = useState("outline"); // outline | competitors | heatmaps
  const [raw, setRaw] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch JSON once (with abort safety)
  useEffect(() => {
    const ctrl = new AbortController();
    (async () => {
      try {
        setLoading(true);
        const res = await fetch("/data/contenteditor.json", {
          cache: "no-store",
          signal: ctrl.signal,
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setRaw(data);
        setError("");
      } catch (e) {
        if (e.name !== "AbortError") {
          setError(e?.message || "Failed to load contenteditor.json");
        }
      } finally {
        setLoading(false);
      }
    })();
    return () => ctrl.abort();
  }, []);

  // Derive the ACTIVE host:
  // 1) prop `domain`
  // 2) page whose ui.query or primaryKeyword matches the saved editor query
  // 3) the only unique host present in the file (if exactly one)
  const activeHost = useMemo(() => {
    const arr = normalizePages(raw);
    if (!arr.length) return "";

    if (domain) return toHost(domain);

    // Try the saved editor query from localStorage
    let savedQuery = "";
    try {
      const rawLS = localStorage.getItem("content-editor-state");
      if (rawLS) {
        const saved = JSON.parse(rawLS);
        savedQuery = String(saved?.query || "").toLowerCase().trim();
      }
    } catch {}

    if (savedQuery) {
      const hit = arr.find((p) => {
        const q = (p?.ui?.query || p?.primaryKeyword || "").toLowerCase().trim();
        return q && q === savedQuery;
      });
      if (hit) return pageHost(hit);
    }

    // If the file effectively targets a single domain, use it
    const hosts = Array.from(new Set(arr.map(pageHost).filter(Boolean)));
    if (hosts.length === 1) return hosts[0];

    return "";
  }, [raw, domain]);

  // Filter pages for the active host (strict match; no fallback to other domains)
  const pages = useMemo(() => {
    const arr = normalizePages(raw);
    if (!arr.length || !activeHost) return [];
    return arr.filter((p) => pageHost(p) === activeHost);
  }, [raw, activeHost]);

  // Build outline strictly from JSON `headings` for the matched domain;
  // fall back to parsing the current editor's HTML only if nothing in JSON.
  const outline = useMemo(() => {
    const seen = new Set();
    const out = [];

    const push = (level, title) => {
      const key = `${level}|${title}`.toLowerCase();
      if (title && !seen.has(key)) {
        seen.add(key);
        out.push({ level: level || "H2", title });
      }
    };

    for (const page of pages) {
      const heads = Array.isArray(page?.headings) ? page.headings : null;
      if (heads && heads.length) {
        heads.forEach((h) => push(h.level || "H2", h.title || ""));
      }
    }

    if (out.length) return out;

    // Optional fallback to current editor content
    const fromEditor = extractHeadingsFromHTML(editorContent);
    fromEditor.forEach((h) => push(h.level, h.title));

    return out;
  }, [pages, editorContent]);

  const count = outline.length;

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

        {/* Actions (placeholders) */}
        <div className="flex items-center gap-2">
          <Chip>{count} Headings</Chip>
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded-md border border-[var(--border)] bg-[var(--bg-panel)] px-2.5 py-1.5 text-[12px] font-medium text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors"
            onClick={() => {}}
          >
            <Sparkles size={14} /> All Headings
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded-md border border-amber-200 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/30 px-2.5 py-1.5 text-[12px] font-semibold text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/30 transition-colors"
            onClick={() => {}}
          >
            <Plus size={14} /> Generate article
          </button>
        </div>
      </div>

      {/* Outline list */}
      {tab === "outline" && (
        <div className="mt-3 overflow-y-auto pr-1" style={{ maxHeight: maxListHeight }}>
          {loading ? (
            <div className="grid place-items-center rounded-xl border border-dashed border-[var(--border)] py-10 text-[var(--muted)] text-[12px]">
              Loading outline…
            </div>
          ) : error ? (
            <div className="grid place-items-center rounded-xl border border-dashed border-[var(--border)] py-10 text-[var(--muted)] text-[12px]">
              {error}
            </div>
          ) : count === 0 ? (
            <div className="grid place-items-center rounded-xl border border-dashed border-[var(--border)] py-10 text-[var(--muted)] text-[12px]">
              No headings found for this domain.
            </div>
          ) : (
            <div className="space-y-2">
              {outline.map((h, i) => (
                <OutlineRow
                  key={`${h.level}-${i}-${h.title}`}
                  level={h.level}
                  title={h.title}
                  onPaste={() => onPasteToEditor?.(h.title)}
                  onAddInstruction={() => onPasteToEditor?.(`Add instruction for: ${h.title}`)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {tab === "competitors" && (
        <div className="mt-4 grid place-items-center rounded-xl border border-dashed border-[var(--border)] py-10 text-[var(--muted)] text-[12px]">
          Competitor mapping view — placeholder.
        </div>
      )}

      {tab === "heatmaps" && (
        <div className="mt-4 grid place-items-center rounded-xl border border-dashed border-[var(--border)] py-10 text-[var(--muted)] text-[12px]">
          Heatmap of headings vs. SERP frequency — placeholder.
        </div>
      )}
    </div>
  );
}
