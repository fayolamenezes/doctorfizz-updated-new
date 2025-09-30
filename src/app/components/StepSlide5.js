"use client";

import { useState, useEffect, useRef } from "react";
import { ArrowRight, ArrowLeft, ChevronDown, Plus, X } from "lucide-react";

export default function StepSlide5({ onNext, onBack, onCompetitorSubmit }) {
  /* ---------------- State ---------------- */
  const [selectedBusinessCompetitors, setSelectedBusinessCompetitors] = useState([]);
  const [selectedSearchCompetitors, setSelectedSearchCompetitors] = useState([]);

  // Inline “More → input”
  const [addingBusiness, setAddingBusiness] = useState(false);
  const [addingSearch, setAddingSearch] = useState(false);
  const [bizInput, setBizInput] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const [showSummary, setShowSummary] = useState(false);

  // Fixed-height shell (match StepSlide4)
  const panelRef = useRef(null);
  const scrollRef = useRef(null);
  const bottomBarRef = useRef(null);
  const [panelHeight, setPanelHeight] = useState(null);

  const lastSubmittedData = useRef(null);

  /* ---------------- Suggestions ---------------- */
  const businessCompetitors = ["Comp-1", "Comp-2", "Comp-3", "Comp-4", "More"];
  const searchEngineCompetitors = ["Comp-1", "Comp-2", "Comp-3", "Comp-4", "More"];

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
    <div className="w-full h-full flex flex-col bg-transparent">
      <div className="px-6 md:px-8 pt-6">
        <div
          ref={panelRef}
          className="mx-auto w-full max-w-[1120px] rounded-2xl bg-transparent"
          style={{ padding: "0px 24px", height: panelHeight ? `${panelHeight}px` : "auto" }}
        >
          <style jsx>{`
            .inner-scroll { scrollbar-width: none; -ms-overflow-style: none; }
            .inner-scroll::-webkit-scrollbar { display: none; }
          `}</style>

          <div ref={scrollRef} className="inner-scroll h-full w-full overflow-y-auto">
            <div className="flex flex-col items-start text-start gap-6 max-w-[820px] mx-auto">
              {/* Step label */}
              <div className="text-[var(--muted)] text-sm font-medium">Step - 5</div>
<div className="spacer-line w-[80%] self-start h-[1px] bg-[#d45427] mt-[-1%]"></div>
              {/* Heading */}
              <div className="space-y-4 max-w-[640px]">
                <h1 className="text-[22px] md:text-[26px] font-bold text-[var(--text)]">
                  Pick your competitors to compare.
                </h1>
                <p className="text-[15px] text-[var(--muted)] leading-relaxed">
                  Choose from our suggestions or add your own.
                </p>
              </div>

              {/* BUSINESS SECTION */}
              <div className="w-full max-w-[880px] text-left space-y-4">
                <h3 className="text-md font-medium text-[var(--text)]">Business Competitors</h3>

                <div className="flex flex-wrap gap-3 items-center">
                  {businessCompetitors.map((label) => {
                    const isSelected = selectedBusinessCompetitors.includes(label);

                    if (label === "More" && addingBusiness) {
                      return (
                        <div key="biz-inline-input" className="flex items-center gap-2">
                          <input
                            id="biz-more-input"
                            value={bizInput}
                            onChange={(e) => setBizInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") addCustomBusiness();
                            }}
                            placeholder="Add business competitor"
                            className="px-4 py-2 border border-[#d45427] rounded-xl bg-[var(--input)] text-[var(--text)] text-sm"
                          />
                          <button
                            onClick={addCustomBusiness}
                            className="px-3 py-2 bg-[image:var(--infoHighlight-gradient)] text-white rounded-xl"
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
                        className={`px-4 py-2 rounded-xl border text-sm font-medium transition-all duration-200 ${
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

                {/* Selected BUSINESS below this section */}
                {selectedBusinessCompetitors.length > 0 && (
                  <div className="pt-2">
                    <h4 className="text-sm font-medium text-[var(--text)] mb-3">
                      Selected Business Competitors ({selectedBusinessCompetitors.length})
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedBusinessCompetitors.map((label, idx) => (
                        <div
                          key={`biz-pill-${label}-${idx}`}
                          className="group relative inline-flex items-center text-white rounded-xl font-medium bg-[image:var(--infoHighlight-gradient)] text-sm transition-all duration-300 px-6 py-3 hover:pr-12"
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
              <div className="w-full max-w-[880px] text-left space-y-4">
                <h3 className="text-md font-medium text-[var(--text)]">Search Engine Competitors</h3>

                <div className="flex flex-wrap gap-3 items-center">
                  {searchEngineCompetitors.map((label) => {
                    const isSelected = selectedSearchCompetitors.includes(label);

                    if (label === "More" && addingSearch) {
                      return (
                        <div key="search-inline-input" className="flex items-center gap-2">
                          <input
                            id="search-more-input"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") addCustomSearch();
                            }}
                            placeholder="Add search competitor"
                            className="px-4 py-2 border border-[#d45427] rounded-xl bg-[var(--input)] text-[var(--text)] text-sm"
                          />
                          <button
                            onClick={addCustomSearch}
                            className="px-3 py-2 bg-[image:var(--infoHighlight-gradient)] text-white rounded-xl"
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
                        className={`px-4 py-2 rounded-xl border text-sm font-medium transition-all duration-200 ${
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

                {/* Selected SEARCH below this section */}
                {selectedSearchCompetitors.length > 0 && (
                  <div className="pt-2">
                    <h4 className="text-sm font-medium text-[var(--text)] mb-3">
                      Selected Search Engine Competitors ({selectedSearchCompetitors.length})
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedSearchCompetitors.map((label, idx) => (
                        <div
                          key={`search-pill-${label}-${idx}`}
                          className="group relative inline-flex items-center text-white rounded-xl font-medium bg-[image:var(--infoHighlight-gradient)] text-sm transition-all duration-300 px-6 py-3 hover:pr-12"
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

              {/* Summary (unchanged) */}
              {showSummary && (
                <div className="max-w-[640px] text-left self-start mt-6">
                  {/* <h3 className="text-[18px] font-bold text-[var(--text)] mb-3">
                    Here’s your site report — take a quick look on the Info Tab.
                  </h3>
                  <p className="text-[15px] text-[var(--muted)] mt-2">
                    If not, Want to do some changes?
                  </p> */}
                </div>
              )}

              <div className="h-2" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar (same styling as StepSlide4) */}
      <div ref={bottomBarRef} className="flex-shrink-0 bg-transparent">
        <div className="border-t border-[var(--border)]" />
        <div className="mx-auto w-full max-w-[1120px] px-6 md:px-8">
          <div className="py-7 flex justify-center gap-4">
            <button
              onClick={onBack}
              type="button"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--input)] px-6 py-3 text-[var(--text)] hover:bg-[var(--input)] shadow-sm border border-[#d45427]"
            >
              <ArrowLeft size={16} /> Back
            </button>

            {showSummary && (
              <button
                onClick={onNext}
                type="button"
                className="inline-flex items-center gap-2 rounded-full bg-[image:var(--infoHighlight-gradient)] px-6 py-3 text-white hover:bg-gray-800 shadow-sm"
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
