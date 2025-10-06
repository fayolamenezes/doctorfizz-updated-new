"use client";

import { useState, useEffect, useRef } from "react";
import { ArrowRight, ArrowLeft, ChevronDown, Plus, X } from "lucide-react";

export default function StepSlide5({ onNext, onBack, onCompetitorSubmit }) {
  /* ---------------- State ---------------- */
  const [selectedBusinessCompetitors, setSelectedBusinessCompetitors] = useState([]);
  const [selectedSearchCompetitors, setSelectedSearchCompetitors] = useState([]);

  // Suggested pills now load dynamically from /data/seo-data.json
  const [businessSuggestions, setBusinessSuggestions] = useState([
    "Comp-1",
    "Comp-2",
    "Comp-3",
    "Comp-4",
    "More",
  ]);
  const [searchSuggestions, setSearchSuggestions] = useState([
    "Comp-1",
    "Comp-2",
    "Comp-3",
    "Comp-4",
    "More",
  ]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  // Inline “More → input”
  const [addingBusiness, setAddingBusiness] = useState(false);
  const [addingSearch, setAddingSearch] = useState(false);
  const [bizInput, setBizInput] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const [showSummary, setShowSummary] = useState(false);

  // Fixed-height shell (match other steps)
  const panelRef = useRef(null);
  const scrollRef = useRef(null);
  const bottomBarRef = useRef(null);
  const [panelHeight, setPanelHeight] = useState(null);

  const lastSubmittedData = useRef(null);

  /* ---------------- Utilities: determine target site like the dashboard ---------------- */
  function normalizeHost(input) {
    if (!input || typeof input !== "string") return null;
    let s = input.trim().toLowerCase();
    try {
      if (!/^https?:\/\//.test(s)) s = `https://${s}`;
      const u = new URL(s);
      s = u.hostname || s;
    } catch {
      s = s.replace(/^https?:\/\//, "").split("/")[0];
    }
    return s.replace(/^www\./, "");
  }

  function getStoredSite() {
    const keys = [
      "websiteData",
      "site",
      "website",
      "selectedWebsite",
      "drfizzm.site",
      "drfizzm.website",
    ];
    for (const k of keys) {
      try {
        const raw = localStorage.getItem(k) ?? sessionStorage.getItem(k);
        if (!raw) continue;
        try {
          const obj = JSON.parse(raw);
          const val = obj?.website || obj?.site || obj?.domain || obj?.host || raw;
          const host = normalizeHost(val);
          if (host) return host;
        } catch {
          const host = normalizeHost(raw);
          if (host) return host;
        }
      } catch {}
    }
    return null;
  }

  function getTargetSite() {
    try {
      const params = new URLSearchParams(window.location.search);
      const fromParam = normalizeHost(params.get("site"));
      if (fromParam) return fromParam;
    } catch {}
    const fromStorage = getStoredSite();
    if (fromStorage) return fromStorage;
    return "example.com";
  }

  function extractCompetitors(row) {
    const biz = [];
    const ser = [];
    for (let i = 1; i <= 6; i++) {
      // Business competitors: expect 1..4 but be generous up to 6
      const v = row?.[`Business_Competitor_${i}`];
      if (typeof v === "string" && v.trim()) biz.push(v.trim());
    }
    for (let i = 1; i <= 6; i++) {
      const v = row?.[`Search_Competitor_${i}`];
      if (typeof v === "string" && v.trim()) ser.push(v.trim());
    }
    // De-dup, preserve order
    const dedup = (arr) => {
      const seen = new Set();
      return arr.filter((x) => {
        const k = x.toLowerCase();
        if (seen.has(k)) return false;
        seen.add(k);
        return true;
      });
    };
    return { biz: dedup(biz).slice(0, 8), ser: dedup(ser).slice(0, 8) };
  }

  /* ---------------- Load suggestions for the chosen site ---------------- */
  useEffect(() => {
    let isMounted = true;
    async function load() {
      setIsLoading(true);
      setLoadError(null);
      try {
        const target = getTargetSite();
        const res = await fetch("/data/seo-data.json", { cache: "no-store" });
        if (!res.ok) throw new Error(`Failed to load seo-data.json (${res.status})`);
        const rows = await res.json();
        const host = normalizeHost(target);
        const variants = host ? [host, `www.${host}`] : [];

        const match = rows.find((r) => {
          const d1 = normalizeHost(r?.Domain);
          const d2 = normalizeHost(r?.["Domain/Website"]);
          return (d1 && variants.includes(d1)) || (d2 && variants.includes(d2));
        });

        const { biz, ser } = extractCompetitors(match || {});

        const bizFinal = (biz.length ? biz : ["Comp-1", "Comp-2", "Comp-3", "Comp-4"]).concat("More");
        const serFinal = (ser.length ? ser : ["Comp-1", "Comp-2", "Comp-3", "Comp-4"]).concat("More");

        if (isMounted) {
          setBusinessSuggestions(bizFinal);
          setSearchSuggestions(serFinal);
        }
      } catch (err) {
        if (isMounted) {
          setLoadError(err?.message || "Failed to load competitor data");
          // keep placeholders and ensure More is present
          setBusinessSuggestions((prev) => (prev.includes("More") ? prev : prev.concat("More")));
          setSearchSuggestions((prev) => (prev.includes("More") ? prev : prev.concat("More")));
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  /* ---------------- Fixed panel height ---------------- */
  const recomputePanelHeight = () => {
    if (!panelRef.current) return;
    const vpH = window.innerHeight;
    const barH = bottomBarRef.current?.getBoundingClientRect().height ?? 0;
    const topOffset = panelRef.current.getBoundingClientRect().top;
    const paddingGuard = 24;
    const h = Math.max(360, vpH - barH - topOffset - paddingGuard);
    setPanelHeight(h);
  };

  useEffect(() => {
    recomputePanelHeight();
    const ro = new ResizeObserver(recomputePanelHeight);
    if (panelRef.current) ro.observe(panelRef.current);
    window.addEventListener("resize", recomputePanelHeight);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", recomputePanelHeight);
    };
  }, []);

  useEffect(() => {
    recomputePanelHeight();
  }, [
    showSummary,
    selectedBusinessCompetitors.length,
    selectedSearchCompetitors.length,
    addingBusiness,
    addingSearch,
  ]);

  /* ---------------- Handlers ---------------- */
  const toggleBusiness = (label) => {
    if (label === "More") {
      setAddingBusiness(true);
      setTimeout(() => document.getElementById("biz-more-input")?.focus(), 50);
      return;
    }
    setSelectedBusinessCompetitors((prev) =>
      prev.includes(label) ? prev.filter((c) => c !== label) : [...prev, label]
    );
  };

  const toggleSearch = (label) => {
    if (label === "More") {
      setAddingSearch(true);
      setTimeout(() => document.getElementById("search-more-input")?.focus(), 50);
      return;
    }
    setSelectedSearchCompetitors((prev) =>
      prev.includes(label) ? prev.filter((c) => c !== label) : [...prev, label]
    );
  };

  const removeBusiness = (label) =>
    setSelectedBusinessCompetitors((prev) => prev.filter((c) => c !== label));
  const removeSearch = (label) =>
    setSelectedSearchCompetitors((prev) => prev.filter((c) => c !== label));

  const addCustomBusiness = () => {
    const v = bizInput.trim();
    if (v && !selectedBusinessCompetitors.includes(v)) {
      setSelectedBusinessCompetitors((prev) => [...prev, v]);
    }
    setBizInput("");
    setTimeout(() => document.getElementById("biz-more-input")?.focus(), 50);
  };

  const addCustomSearch = () => {
    const v = searchInput.trim();
    if (v && !selectedSearchCompetitors.includes(v)) {
      setSelectedSearchCompetitors((prev) => [...prev, v]);
    }
    setSearchInput("");
    setTimeout(() => document.getElementById("search-more-input")?.focus(), 50);
  };

  /* ---------------- Submit + Summary toggle ---------------- */
  useEffect(() => {
    const totalSelected =
      selectedBusinessCompetitors.length + selectedSearchCompetitors.length;

    if (totalSelected > 0) {
      const payload = {
        businessCompetitors: selectedBusinessCompetitors,
        searchCompetitors: selectedSearchCompetitors,
        totalCompetitors: [
          ...selectedBusinessCompetitors,
          ...selectedSearchCompetitors,
        ],
      };
      const curr = JSON.stringify(payload);
      if (curr !== JSON.stringify(lastSubmittedData.current)) {
        lastSubmittedData.current = payload;
        onCompetitorSubmit?.(payload);
      }
      setShowSummary(true);
    } else {
      setShowSummary(false);
      onCompetitorSubmit?.({
        businessCompetitors: [],
        searchCompetitors: [],
        totalCompetitors: [],
      });
    }
  }, [selectedBusinessCompetitors, selectedSearchCompetitors, onCompetitorSubmit]);

  // Scroll to top when summary shows
  useEffect(() => {
    if (scrollRef.current && showSummary) {
      scrollRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [showSummary]);

  /* ---------------- UI ---------------- */
  return (
    <div className="w-full h-full flex flex-col bg-transparent overflow-x-hidden">
      <div className="px-3 sm:px-4 md:px-6 pt-4 sm:pt-5 md:pt-6">
        <div
          ref={panelRef}
          className="mx-auto w-full max-w-[1120px] rounded-2xl bg-transparent box-border"
          style={{ padding: "0px 24px", height: panelHeight ? `${panelHeight}px` : "auto" }}
        >
          <style jsx>{`
            .inner-scroll { scrollbar-width: none; -ms-overflow-style: none; }
            .inner-scroll::-webkit-scrollbar { display: none; }
          `}</style>

          <div ref={scrollRef} className="inner-scroll h-full w-full overflow-y-auto">
            <div className="flex flex-col items-start text-start gap-5 sm:gap-6 md:gap-8 max-w-[820px] mx-auto">
              {/* Step label */}
              <div className="text-[11px] sm:text-[12px] md:text-[13px] text-[var(--muted)] font-medium">
                Step - 5
              </div>
              <div className="spacer-line w-[80%] self-start h-[1px] bg-[#d45427] mt-[-1%]" />

              {/* Heading */}
              <div className="space-y-2.5 sm:space-y-3 max-w-[640px]">
                <h1 className="text-[16px] sm:text-[18px] md:text-[22px] lg:text-[26px] font-bold text-[var(--text)]">
                  Pick your competitors to compare.
                </h1>
                <p className="text-[13px] sm:text-[14px] md:text-[15px] text-[var(--muted)] leading-relaxed">
                  {isLoading
                    ? "Scanning your site…"
                    : loadError
                    ? "Showing starter suggestions (we'll refine once data is available)."
                    : "I scanned your site and found these competitors."}
                </p>
              </div>

              {/* BUSINESS SECTION */}
              <div className="w-full max-w-[880px] text-left space-y-3 sm:space-y-4">
                <h3 className="text-[13px] sm:text-[14px] md:text-[15px] font-medium text-[var(--text)]">
                  Business Competitors
                </h3>

                <div className="flex flex-wrap gap-2.5 sm:gap-3 items-center">
                  {businessSuggestions.map((label) => {
                    const isSelected = selectedBusinessCompetitors.includes(label);

                    if (label === "More" && addingBusiness) {
                      return (
                        <div key="biz-inline-input" className="flex items-center gap-2">
                          <input
                            id="biz-more-input"
                            value={bizInput}
                            onChange={(e) => setBizInput(e.target.value)}
                            onKeyDown={(e) => { if (e.key === "Enter") addCustomBusiness(); }}
                            placeholder="Add business competitor"
                            className="px-3 sm:px-4 py-2 border border-[#d45427] rounded-xl bg-[var(--input)] text-[12px] sm:text-[13px] md:text-[14px] text-[var(--text)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[#d45427]"
                          />
                          <button
                            onClick={addCustomBusiness}
                            className="px-3 sm:px-4 py-2 bg-[image:var(--infoHighlight-gradient)] text-white rounded-xl hover:opacity-90"
                          >
                            <Plus size={16} />
                          </button>
                          <button
                            onClick={() => { setAddingBusiness(false); setBizInput(""); }}
                            className="px-2 py-2 text-[var(--muted)] hover:text-red-500 rounded-xl"
                            title="Cancel"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      );
                    }

                    return (
                      <button
                        key={`biz-${label}`}
                        onClick={() => toggleBusiness(label)}
                        className={`px-3 sm:px-4 py-2 rounded-xl border text-[12px] sm:text-[13px] md:text-[14px] font-medium transition-all duration-200 ${
                          isSelected
                            ? "bg-[var(--input)] text-[var(--text)] border-[#d45427]"
                            : "bg-[var(--input)] text-[var(--muted)] border-[var(--border)] hover:bg-[var(--border)]"
                        }`}
                      >
                        {label}
                        {isSelected ? (
                          <ChevronDown size={16} className="inline ml-1 -rotate-180" />
                        ) : label !== "More" ? (
                          <Plus size={16} className="inline ml-1" />
                        ) : null}
                      </button>
                    );
                  })}
                </div>

                {/* Selected BUSINESS */}
                {selectedBusinessCompetitors.length > 0 && (
                  <div className="pt-1">
                    <h4 className="text-[12px] sm:text-[13px] md:text-[14px] font-medium text-[var(--text)] mb-2.5 sm:mb-3">
                      Selected Business Competitors ({selectedBusinessCompetitors.length})
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedBusinessCompetitors.map((label, idx) => (
                        <div
                          key={`biz-pill-${label}-${idx}`}
                          className="group relative inline-flex items-center text-white rounded-xl font-medium bg-[image:var(--infoHighlight-gradient)] text-[12px] sm:text-[13px] md:text-[14px] transition-all duration-300 px-4 sm:px-5 md:px-6 py-2.5 sm:py-3 hover:pr-12"
                        >
                          <span>{label}</span>
                          <button
                            onClick={() => removeBusiness(label)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 scale-50 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 text-[var(--input)]"
                            title="Remove"
                          >
                            <X size={18} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* SEARCH SECTION */}
              <div className="w-full max-w-[880px] text-left space-y-3 sm:space-y-4">
                <h3 className="text-[13px] sm:text-[14px] md:text-[15px] font-medium text-[var(--text)]">
                  Search Engine Competitors
                </h3>

                <div className="flex flex-wrap gap-2.5 sm:gap-3 items-center">
                  {searchSuggestions.map((label) => {
                    const isSelected = selectedSearchCompetitors.includes(label);

                    if (label === "More" && addingSearch) {
                      return (
                        <div key="search-inline-input" className="flex items-center gap-2">
                          <input
                            id="search-more-input"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            onKeyDown={(e) => { if (e.key === "Enter") addCustomSearch(); }}
                            placeholder="Add search competitor"
                            className="px-3 sm:px-4 py-2 border border-[#d45427] rounded-xl bg-[var(--input)] text-[12px] sm:text-[13px] md:text-[14px] text-[var(--text)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[#d45427]"
                          />
                          <button
                            onClick={addCustomSearch}
                            className="px-3 sm:px-4 py-2 bg-[image:var(--infoHighlight-gradient)] text-white rounded-xl hover:opacity-90"
                          >
                            <Plus size={16} />
                          </button>
                          <button
                            onClick={() => { setAddingSearch(false); setSearchInput(""); }}
                            className="px-2 py-2 text-[var(--muted)] hover:text-red-500 rounded-xl"
                            title="Cancel"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      );
                    }

                    return (
                      <button
                        key={`search-${label}`}
                        onClick={() => toggleSearch(label)}
                        className={`px-3 sm:px-4 py-2 rounded-xl border text-[12px] sm:text-[13px] md:text-[14px] font-medium transition-all duration-200 ${
                          isSelected
                            ? "bg-[var(--input)] text-[var(--text)] border-[#d45427]"
                            : "bg-[var(--input)] text-[var(--muted)] border-[var(--border)] hover:bg-[var(--border)]"
                        }`}
                      >
                        {label}
                        {isSelected ? (
                          <ChevronDown size={16} className="inline ml-1 -rotate-180" />
                        ) : label !== "More" ? (
                          <Plus size={16} className="inline ml-1" />
                        ) : null}
                      </button>
                    );
                  })}
                </div>

                {/* Selected SEARCH */}
                {selectedSearchCompetitors.length > 0 && (
                  <div className="pt-1">
                    <h4 className="text-[12px] sm:text-[13px] md:text-[14px] font-medium text-[var(--text)] mb-2.5 sm:mb-3">
                      Selected Search Engine Competitors ({selectedSearchCompetitors.length})
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedSearchCompetitors.map((label, idx) => (
                        <div
                          key={`search-pill-${label}-${idx}`}
                          className="group relative inline-flex items-center text-white rounded-xl font-medium bg-[image:var(--infoHighlight-gradient)] text-[12px] sm:text-[13px] md:text-[14px] transition-all duration-300 px-4 sm:px-5 md:px-6 py-2.5 sm:py-3 hover:pr-12"
                        >
                          <span>{label}</span>
                          <button
                            onClick={() => removeSearch(label)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 scale-50 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 text-[var(--input)]"
                            title="Remove"
                          >
                            <X size={18} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="h-2" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar (same rhythm as other steps) */}
      <div ref={bottomBarRef} className="flex-shrink-0 bg-transparent">
        <div className="border-t border-[var(--border)]" />
        <div className="mx-auto w-full max-w-[1120px] px-3 sm:px-4 md:px-6">
          <div className="py-5 sm:py-6 md:py-7 flex justify-center gap-3 sm:gap-4">
            <button
              onClick={onBack}
              type="button"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--input)] px-5 sm:px-6 py-2.5 sm:py-3 text-[12px] sm:text-[13px] md:text-[14px] text-[var(--text)] hover:bg-[var(--input)] shadow-sm border border-[#d45427]"
            >
              <ArrowLeft size={16} /> Back
            </button>

            {showSummary && (
              <button
                onClick={onNext}
                type="button"
                className="inline-flex items-center gap-2 rounded-full bg-[image:var(--infoHighlight-gradient)] px-5 sm:px-6 py-2.5 sm:py-3 text-white hover:opacity-90 shadow-sm text-[13px] md:text-[14px]"
              >
                Next <ArrowRight size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
