"use client";

import { useEffect, useRef, useMemo, useState } from "react";
import { Pin, PinOff, BarChart2, Play } from "lucide-react";

/* ---------- Video helpers (ADDED) ---------- */
const YT_URL = "https://youtube.com/shorts/_7LPvKmZkwg?si=vD25P17VltV7szZu";
function toYouTubeEmbed(url) {
  try {
    const u = new URL(url);
    // Shorts
    if (u.hostname.includes("youtube.com") && u.pathname.startsWith("/shorts/")) {
      const id = u.pathname.split("/")[2];
      return `https://www.youtube.com/embed/${id}`;
    }
    // Normal watch url
    if (u.hostname.includes("youtube.com") && u.searchParams.get("v")) {
      return `https://www.youtube.com/embed/${u.searchParams.get("v")}`;
    }
    return url;
  } catch {
    return url;
  }
}

function VideoCard({ title, onOpen }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="w-full rounded-xl border border-gray-200 bg-white dark:bg-[var(--extra-input-dark)] dark:border-[var(--extra-border-dark)] p-3 flex items-center gap-3 text-left shadow-sm hover:shadow transition group"
    >
      <div className="w-10 h-10 rounded-full grid place-items-center bg-[image:var(--brand-gradient)] text-white">
        <Play className="shrink-0" size={18} />
      </div>
      <div className="flex-1">
        <div className="font-medium text-gray-900 dark:text-[var(--text)]">{title}</div>
        <div className="text-xs text-gray-500 dark:text-[var(--muted)]">Click to watch</div>
      </div>
      <div className="text-xs text-gray-500 group-hover:text-[#d45427]">Open</div>
    </button>
  );
}

function VideoModal({ open, title, url, onClose, onExpand }) {
  if (!open) return null;
  const embedUrl = toYouTubeEmbed(url);
  return (
    <div className="fixed inset-0 z-[999] bg-black/70 grid place-items-center p-4">
      <div className="relative w-full max-w-4xl rounded-2xl bg-[var(--panel)] text-[var(--text)] shadow-lg p-4">
        <button
          onClick={onClose}
          className="absolute right-3 top-3 text-[var(--muted)] hover:text-[var(--text)]"
          aria-label="Close"
        >
          ✕
        </button>
        <div className="text-lg font-semibold mb-3">{title}</div>
        <div className="aspect-video w-full overflow-hidden rounded-xl bg-black">
          <iframe
            className="w-full h-full"
            src={embedUrl}
            title={title}
            allowFullScreen
            frameBorder="0"
          />
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={onExpand}
            className="px-4 py-2 rounded-md text-white font-medium shadow bg-[image:var(--brand-gradient)]"
          >
            Expand in New Tab
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Existing helpers from your file (unchanged) ---------------- */
function normalizeDomain(input = "") {
  try {
    const url = input.includes("://") ? new URL(input) : new URL(`https://${input}`);
    let host = url.hostname.toLowerCase();
    if (host.startsWith("www.")) host = host.slice(4);
    return host;
  } catch {
    return String(input)
      .toLowerCase()
      .replace(/^https?:\/\/\//, "")
      .replace(/^https?:\/\//, "")
      .replace(/^www\./, "")
      .split("/")[0];
  }
}
function coerceNumber(x) {
  if (typeof x === "number") return x;
  if (typeof x === "string") {
    const v = Number(x.replace(/[, ]/g, ""));
    return Number.isFinite(v) ? v : undefined;
  }
  return undefined;
}
function mapRowToMini(row) {
  if (!row || typeof row !== "object") return null;
  const domain = normalizeDomain(row["Domain/Website"] ?? "");
  return {
    domain,
    domainRating: coerceNumber(row["Domain_Rating"]),
    organicTrafficMonthly: coerceNumber(row["Organic_Traffic"]),
    organicKeywordsTotal: coerceNumber(row["Total_Organic_Keywords"]),
  };
}
function formatNumber(num) {
  if (num === null || num === undefined || isNaN(num)) return "--";
  const abs = Math.abs(num);
  if (abs >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + "B";
  if (abs >= 1_000_000) return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  if (abs >= 1_000) return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "k";
  return String(num);
}

/* --- Reusable Website Stats card (same as your file) --- */
function WebsiteStatsCard({ website, stats }) {
  return (
    <div className="rounded-2xl bg-white border border-gray-200 shadow-sm p-5 dark:bg-[var(--extra-input-dark)] dark:border-[var(--extra-border-dark)]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="text-[12px] tracking-wide text-gray-500 dark:text-[var(--muted)] font-medium">
          WEBSITE :
          <span className="ml-2 text-[13px] font-semibold text-[#d45427]">{website}</span>
        </div>
        <span className="inline-flex items-center rounded-full bg-emerald-100 text-emerald-700 text-[11px] font-semibold px-2.5 py-[3px]">
          Good
        </span>
      </div>

      {/* Stats strip */}
      <div className="mt-3 rounded-xl bg-white p-4 dark:bg-[var(--extra-input-dark)]">
        <div className="flex items-stretch divide-x divide-gray-200 dark:divide-[var(--extra-border-dark)]">
          {[
            ["Domain Authority", stats.domainAuthority],
            ["Organic Traffic", stats.organicTraffic],
            ["Organic Keyword", stats.organicKeyword],
          ].map(([label, value], idx) => {
            const parts = String(label).split(" ");
            return (
              <div key={idx} className="flex-1 px-6 text-center">
                <div className="text-[13px] leading-[16px] text-gray-600 dark:text-[var(--muted)] font-medium">
                  {parts[0]}
                  <br />
                  {parts.slice(1).join(" ")}
                </div>
                <div className="mt-2 mb-1.5 flex items-center justify-center gap-2">
                  <div className="text-[28px] leading-none font-extrabold text-gray-900 dark:text-[var(--text)]">{Number.isFinite(value) ? formatNumber(value) : "--"}</div>
                  {value >= 70 ? (
                  <span className="text-emerald-400 text-[14px]">↑</span>
                ) : (
                  <span className="text-red-400 text-[14px]">↓</span>
                )}
                </div>
                <div className="text-[13px] text-gray-500 dark:text-[var(--muted)]" suppressHydrationWarning>
                  {Math.floor(Math.random() * (100 - 26 + 1)) + 26}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function InfoPanel({
  isOpen,
  onClose,
  isPinned,
  setIsPinned,
  websiteData,
  businessData,
  languageLocationData,
  keywordData = [],
  competitorData = null, // full payload from Step 5
  currentStep,
}) {
  const panelRef = useRef(null);

  /* ADDED: active video state */
  const [activeVideo, setActiveVideo] = useState(null);

  /* load seo-data.json (data only; no UI changes) */
  const [rows, setRows] = useState(null);
  const [dataError, setDataError] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch("/data/seo-data.json", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load seo-data.json");
        const json = await res.json();
        const mapped = Array.isArray(json) ? json.map(mapRowToMini).filter(Boolean) : [];
        if (alive) setRows(mapped);
      } catch (e) {
        if (alive) setDataError("Couldn't load /data/seo-data.json");
      }
    })();
    return () => { alive = false; };
  }, []);

  const selected = useMemo(() => {
    if (!rows?.length) return null;
    const key = normalizeDomain(websiteData?.website || "");
    return rows.find(r => r.domain === key) || rows.find(r => r.domain === `www.${key}`) || null;
  }, [rows, websiteData?.website]);
  // Close on outside click (unless pinned)
  useEffect(() => {
    function handleClickOutside(e) {
      if (isPinned) return;
      if (e.target.closest("#sidebar-info-btn")) return;
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        onClose && onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isPinned, onClose]);

  // Stable dummy stats based on website string
  const generateRandomStats = (website) => {
    if (!website) return { domainAuthority: 49, organicTraffic: 72, organicKeyword: 75 };
    const seed = website.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
    const r1 = (seed * 9301 + 49297) % 233280;
    const r2 = (r1 * 9301 + 49297) % 233280;
    const r3 = (r2 * 9301 + 49297) % 233280;
    return {
      domainAuthority: Math.floor((r1 / 233280) * 100) + 1,
      organicTraffic: Math.floor((r2 / 233280) * 100) + 1,
      organicKeyword: Math.floor((r3 / 233280) * 100) + 1,
    };
  };

  const stats = selected
    ? {
        domainAuthority: Math.round(selected.domainRating ?? 0),
        organicTraffic: Math.round(selected.organicTrafficMonthly ?? 0),
        organicKeyword: Math.round(selected.organicKeywordsTotal ?? 0),
      }
    : generateRandomStats(websiteData?.website);
  const displayWebsite = websiteData?.website || "yourcompany.com";

  // Utility to make "Comp-1-0" look like "Comp-1"
  const cleanLabel = (s) => (typeof s === "string" ? s.replace(/-\d+$/, "") : s);

  // Safe competitor buckets
  const { businessCompetitors, searchCompetitors, totalCompetitors } = useMemo(() => {
    const empty = { businessCompetitors: [], searchCompetitors: [], totalCompetitors: [] };
    if (!competitorData) return empty;
    return {
      businessCompetitors: Array.isArray(competitorData.businessCompetitors)
        ? competitorData.businessCompetitors
        : [],
      searchCompetitors: Array.isArray(competitorData.searchCompetitors)
        ? competitorData.searchCompetitors
        : [],
      totalCompetitors: Array.isArray(competitorData.totalCompetitors)
        ? competitorData.totalCompetitors
        : [],
    };
  }, [competitorData]);

  /* -------------------- STEP 1 -------------------- */
  const renderStep1Content = () => (
    <div className="space-y-6">
      <WebsiteStatsCard website={displayWebsite} stats={stats} />

      {/* FIX THIS content -> replaced rows with videos */}
      <div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-800 rounded-sm flex items-center justify-center">
            <span className="text-white text-xs">!</span>
          </div>
          <h4 className="text-sm font-bold text-gray-800">FIX THIS</h4>
        </div>
        <div className="place-items-center flex justify-center">
          <div className="divider-gradient-line h-[1px] w-[100%] bg-[image:var(--brand-gradient)] my-2 mb-5"></div>
        </div>

        <VideoCard
          title="How to Build Domain Authority"
          onOpen={() => setActiveVideo({ title: "How to Build Domain Authority", url: YT_URL })}
        />
        <div className="mt-4">
          <VideoCard
            title="Turn Traffic Into Customers"
            onOpen={() => setActiveVideo({ title: "Turn Traffic Into Customers", url: YT_URL })}
          />
        </div>
      </div>
    </div>
  );

  /* -------------------- STEP 2 -------------------- */
  const renderStep2Content = () => (
    <div className="space-y-6">
      <WebsiteStatsCard website={displayWebsite} stats={stats} />

      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-4 h-4 bg-orange-500 rounded-sm flex items-center justify-center">
            <span className="text-white text-xs">!</span>
          </div>
        </div>

        <div className="space-y-4">
          <VideoCard
            title="Industry SEO Strategies"
            onOpen={() => setActiveVideo({ title: "Industry SEO Strategies", url: YT_URL })}
          />
          <VideoCard
            title="How to Build Domain Authority"
            onOpen={() => setActiveVideo({ title: "How to Build Domain Authority", url: YT_URL })}
          />
          <VideoCard
            title="Competitor Research Tools"
            onOpen={() => setActiveVideo({ title: "Competitor Research Tools", url: YT_URL })}
          />
          <VideoCard
            title="Content Planning Guide"
            onOpen={() => setActiveVideo({ title: "Content Planning Guide", url: YT_URL })}
          />
        </div>
      </div>
    </div>
  );

  /* -------------------- STEP 3 -------------------- */
  const renderStep3Content = () => (
    <div className="space-y-6">
      <WebsiteStatsCard website={displayWebsite} stats={stats} />

      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-4 h-4 bg-orange-500 rounded-sm flex items-center justify-center">
            <span className="text-white text-xs">!</span>
          </div>
          <h4 className="text-sm font-bold text-gray-800">FIX THIS</h4>
        </div>
        <div className="place-items-center flex justify-center">
          <div className="divider-gradient-line h-[1px] w-[100%] bg-[image:var(--brand-gradient)] my-2 mb-5"></div>
        </div>

        <div className="space-y-4">
          <VideoCard
            title="Dominate Local Search"
            onOpen={() => setActiveVideo({ title: "Dominate Local Search", url: YT_URL })}
          />
          <VideoCard
            title="Multi-Language SEO"
            onOpen={() => setActiveVideo({ title: "Multi-Language SEO", url: YT_URL })}
          />
          <VideoCard
            title="Location Optimization"
            onOpen={() => setActiveVideo({ title: "Location Optimization", url: YT_URL })}
          />
        </div>
      </div>

      {keywordData.length > 0 && (
        <div className="bg-white rounded-lg p-4 shadow-sm border mt-4 dark:bg-[var(--extra-input-dark)]">
          <div className="text-xs text-gray-600 dark:text-[var(--muted)] font-medium mb-2">
            Selected Keywords ({keywordData.length})
          </div>
          <div className="flex flex-wrap gap-2">
            {keywordData.map((kw, i) => (
              <span key={i} className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm">
                {kw}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  /* -------------------- STEP 4 -------------------- */
  const renderStep4Content = () => (
    <div className="space-y-8">
      <WebsiteStatsCard website={displayWebsite} stats={stats} />

      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-4 h-4 bg-orange-500 rounded-sm flex items-center justify-center">
            <span className="text-white text-xs">!</span>
          </div>
          <h4 className="text-sm font-bold text-gray-800">FIX THIS</h4>
        </div>
        <div className="place-items-center flex justify-center">
          <div className="divider-gradient-line h-[1px] w-[100%] bg-[image:var(--brand-gradient)] my-2 mb-5"></div>
        </div>

        <div className="space-y-4">
          <VideoCard
            title="Keyword Fundamentals — What keywords are & why they matter"
            onOpen={() => setActiveVideo({ title: "Keyword Fundamentals", url: YT_URL })}
          />
          <VideoCard
            title="Volume & Competition — 100–1,000 searches = sweet spot"
            onOpen={() => setActiveVideo({ title: "Volume & Competition", url: YT_URL })}
          />
          <VideoCard
            title="Customer Language — Use words your customers actually search"
            onOpen={() => setActiveVideo({ title: "Customer Language", url: YT_URL })}
          />
        </div>
      </div>
    </div>
  );

  /* -------------------- STEP 5 (competitors list + next actions) -------------------- */
  const renderStep5Content = () => {
    const hasAny =
      (businessCompetitors && businessCompetitors.length > 0) ||
      (searchCompetitors && searchCompetitors.length > 0) ||
      (totalCompetitors && totalCompetitors.length > 0);

    return (
      <div className="space-y-6">
        <WebsiteStatsCard website={displayWebsite} stats={stats} />

        {hasAny ? (
          <>
            {businessCompetitors?.length > 0 && (
              <div className="bg-white rounded-lg p-4 shadow-sm border dark:bg-[var(--extra-input-dark)]">
                <div className="text-xs text-gray-600 dark:text-[var(--muted)] font-medium mb-2">
                  Selected Business Competitors ({businessCompetitors.length})
                </div>
                <div className="flex flex-wrap gap-2">
                  {businessCompetitors.map((c, i) => (
                    <span
                      key={`b-${i}`}
                      className="px-3 py-1 bg-white text-gray-900 border border-blue-600 rounded-full text-sm"
                    >
                      {cleanLabel(c)}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {searchCompetitors?.length > 0 && (
              <div className="bg-white rounded-lg p-4 shadow-sm border dark:bg-[var(--extra-input-dark)]">
                <div className="text-xs text-gray-600 dark:text-[var(--muted)] font-medium mb-2">
                  Selected Search Engine Competitors ({searchCompetitors.length})
                </div>
                <div className="flex flex-wrap gap-2">
                  {searchCompetitors.map((c, i) => (
                    <span
                      key={`s-${i}`}
                      className="px-3 py-1 bg-white text-gray-900 border border-green-600 rounded-full text-sm"
                    >
                      {cleanLabel(c)}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {totalCompetitors?.length > 0 && businessCompetitors.length === 0 && searchCompetitors.length === 0 && (
              <div className="bg-white rounded-lg p-4 shadow-sm border dark:bg-[var(--extra-input-dark)]">
                <div className="text-xs text-gray-600 dark:text-[var(--muted)] font-medium mb-2">
                  Selected Competitors ({totalCompetitors.length})
                </div>
                <div className="flex flex-wrap gap-2">
                  {totalCompetitors.map((c, i) => (
                    <span
                      key={`t-${i}`}
                      className="px-3 py-1 bg-white text-gray-900 border border-gray-300 rounded-full text-sm"
                    >
                      {cleanLabel(c)}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm rounded p-3">
            No competitors selected yet. Pick some to see them here.
          </div>
        )}

        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-4 h-4 bg-orange-500 rounded-sm flex items-center justify-center">
              <span className="text-white text-xs">!</span>
            </div>
            <h4 className="text-sm font-bold text-gray-800">NEXT ACTIONS</h4>
          </div>

          {/* Replaced Next Actions items with videos */}
          <div className="space-y-4">
            <VideoCard
              title="Benchmark Against Competitors"
              onOpen={() => setActiveVideo({ title: "Benchmark Against Competitors", url: YT_URL })}
            />
            <VideoCard
              title="Content Gaps — Identify topics competitors rank for"
              onOpen={() => setActiveVideo({ title: "Content Gaps", url: YT_URL })}
            />
          </div>
        </div>
      </div>
    );
  };

  /* ---- Step5Slide2 compact summary (shown when currentStep === 6) ---- */
  const Pill = ({ children }) => (
    <span className="inline-block rounded-md bg-gray-100 text-gray-700 text-[11px] px-3 py-1 shadow-sm">
      {children}
    </span>
  );

  const MiniCard = ({ title, children }) => (
    <div className="rounded-xl bg-white shadow-sm border border-gray-200 px-4 py-4 dark:bg-[var(--extra-input-dark)] dark:border-[var(--extra-border-dark)]">
      <div className="text-gray-700 dark:text-[var(--muted)] font-semibold text-sm">{title}</div>
      <div className="mt-2 h-px bg-gray-200 dark:bg-[var(--extra-border-dark)]" />
      <div className="mt-4 space-y-3">{children}</div>
    </div>
  );

  const renderStep5Slide2Content = () => {
    const bizTitle = businessData?.industry || businessData?.category || "Business";
    const lang = languageLocationData?.language || "English";
    const state = languageLocationData?.state || languageLocationData?.region || "";
    const city = languageLocationData?.city || languageLocationData?.location || "";

    const bComp = businessCompetitors || [];
    const sComp = searchCompetitors || [];
    const kws = Array.isArray(keywordData) ? keywordData : [];

    return (
      <div className="space-y-3">
        <div className="text-xs font-medium text-gray-500 dark:text-[var(--muted)]">Summary</div>

        <div className="grid grid-cols-1 gap-3">
          <MiniCard title="Business Selected">
            <div className="text-xs text-gray-500 dark:text-[var(--muted)]">{bizTitle}</div>
            <div className="flex flex-wrap gap-2">
              {(bComp.length ? bComp.slice(0, 2) : ["KEYWORD-1"]).map((v, i) => (
                <Pill key={`mini-b-${i}`}>{String(v).toUpperCase()}</Pill>
              ))}
            </div>
          </MiniCard>

          <MiniCard title="Language Selected">
            <div className="text-xs text-gray-600 dark:text-[var(--muted)]">{lang}</div>
            {state && <div className="text-xs text-gray-500 dark:text-[var(--muted)]">{state}</div>}
            {city && <Pill>{String(city).toUpperCase()}</Pill>}
          </MiniCard>

          <MiniCard title="Keyword Selected">
            <div className="flex flex-wrap gap-2">
              {(kws.length ? kws.slice(0, 2) : ["KEYWORD-1", "KEYWORD-2"]).map((k, i) => (
                <Pill key={`mini-k-${i}`}>{String(k).toUpperCase()}</Pill>
              ))}
            </div>
          </MiniCard>

          <MiniCard title="Business Selected">
            <div className="text-xs text-gray-500 dark:text-[var(--muted)]">{bizTitle}</div>
            <div className="flex flex-wrap gap-2">
              {(sComp.length ? sComp.slice(0, 1) : ["COMP-1"]).map((c, i) => (
                <Pill key={`mini-b2-${i}`}>{String(c).toUpperCase()}</Pill>
              ))}
            </div>
          </MiniCard>
        </div>

        <div className="h-px bg-gray-200 dark:bg-[var(--extra-border-dark)] my-3" />

        {renderStep5Content()}
      </div>
    );
  };

  return (
    <>
      {/* Dark-only full-viewport gradient (non-blocking) */}
      <div className="hidden dark:block fixed inset-0 -z-10 pointer-events-none bg-no-repeat bg-cover"
           style={{ backgroundImage: "linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), var(--app-gradient-strong)" }} />
      <div
        ref={panelRef}
        aria-hidden={!isOpen}
        className={
          "fixed left-[80px] top-0 h-screen w-[430px] transition-transform duration-300 ease-in-out z-40 flex flex-col " +
          (isOpen ? "translate-x-0" : "-translate-x-full")
        }
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 pt-6 bg-transparent">
          <div className="flex items-center gap-3">
            <BarChart2 className="text-[#111827]" size={26} />
            <h3 className="text-xl font-black text-[#111827] dark:text-[var(--text)]">INFO</h3>
          </div>
        <button
          onClick={() => setIsPinned((p) => !p)}
          className="text-[#111827] hover:text-[#D45427] rounded font-bold dark:text-[var(--text)]"
          title={isPinned ? "Unpin panel" : "Pin panel"}
        >
          {isPinned ? <PinOff size={20}/> : <Pin size={20} />}
        </button>
        </div>
        <div className="place-items-center flex justify-center">
          <div className="divider-gradient-line h-[1px] w-[92.5%] bg-[image:var(--brand-gradient)] my-2 mb-0"></div>
        </div>

        {/* Body */}
        <div
          className="flex-1 overflow-y-auto p-4 bg-transparent"
          style={{ height: "calc(100vh - 60px)", scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <style jsx>{`div::-webkit-scrollbar{display:none}`}</style>

          {currentStep === 1
            ? renderStep1Content()
            : currentStep === 2
            ? renderStep2Content()
            : currentStep === 3
            ? renderStep3Content()
            : currentStep === 4
            ? renderStep4Content()
            : currentStep === 6
            ? renderStep5Slide2Content()
            : renderStep5Content()}
        </div>
      </div>

      {/* Global Video Modal (one instance for all steps) */}
      <VideoModal
        open={!!activeVideo}
        title={activeVideo?.title || ""}
        url={activeVideo?.url || YT_URL}
        onClose={() => setActiveVideo(null)}
        onExpand={() => window.open(activeVideo?.url || YT_URL, "_blank")}
      />
    </>
  );
}
