"use client";

import { useState, useEffect, useRef } from "react";
import { ArrowRight, ArrowLeft, ChevronDown, Plus, X } from "lucide-react";

export default function StepSlide4({ onNext, onBack, onKeywordSubmit }) {
  /* ---------------- State ---------------- */
  const [selectedKeywords, setSelectedKeywords] = useState([]);
  const [customKeyword, setCustomKeyword] = useState("");
  const [showSummary, setShowSummary] = useState(false);

  // Inline “More → input”
  const [showInlineMoreInput, setShowInlineMoreInput] = useState(false);
  const moreInputRef = useRef(null);

  // fixed-height shell (matches StepSlide2/3)
  const panelRef = useRef(null);
  const scrollRef = useRef(null);
  const bottomBarRef = useRef(null);
  const [panelHeight, setPanelHeight] = useState(null);

  const lastSubmittedData = useRef(null);

  /* ---------------- Suggestions (unchanged list) ---------------- */
  const suggestedKeywords = [
    "Keyword A",
    "Keyword B",
    "Keyword C",
    "Keyword D",
    "Keyword E",
    "Keyword F",
    "Keyword G",
    "Keyword H",
    "More",
  ];

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
  }, [showSummary, selectedKeywords.length, showInlineMoreInput]);

  /* ---------------- Keyword handlers (logic unchanged) ---------------- */
  const handleKeywordToggle = (keyword) => {
    if (keyword === "More") {
      setShowInlineMoreInput(true);
      setTimeout(() => moreInputRef.current?.focus(), 50);
      return;
    }
    setSelectedKeywords((prev) =>
      prev.includes(keyword) ? prev.filter((k) => k !== keyword) : [...prev, keyword]
    );
  };

  const handleRemoveKeyword = (keywordToRemove) => {
    setSelectedKeywords((prev) => prev.filter((k) => k !== keywordToRemove));
  };

  const handleAddCustom = () => {
    const trimmed = customKeyword.trim();
    if (trimmed && !selectedKeywords.includes(trimmed)) {
      setSelectedKeywords((prev) => [...prev, trimmed]);
      setCustomKeyword("");
      setTimeout(() => moreInputRef.current?.focus(), 50);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddCustom();
    }
  };

  const handleReset = () => {
    setSelectedKeywords([]);
    setCustomKeyword("");
    setShowInlineMoreInput(false);
    lastSubmittedData.current = null;
    setShowSummary(false);
  };

  /* ---------------- Submit to parent + summary toggle ---------------- */
  useEffect(() => {
    if (selectedKeywords.length > 0) {
      const payload = { keywords: selectedKeywords };
      const curr = JSON.stringify(payload);
      if (curr !== JSON.stringify(lastSubmittedData.current)) {
        lastSubmittedData.current = payload;
        onKeywordSubmit?.(payload);
      }
      setShowSummary(true);
    } else {
      setShowSummary(false);
      onKeywordSubmit?.({ keywords: [] });
    }
  }, [selectedKeywords, onKeywordSubmit]);

  // scroll to top when summary appears
  useEffect(() => {
    if (scrollRef.current && showSummary) {
      scrollRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [showSummary]);

  /* ---------------- UI ---------------- */
  return (
    <div className="w-full h-full flex flex-col bg-transparent overflow-x-hidden">
      {/* Fixed-height section */}
      <div className="px-3 sm:px-4 md:px-6 pt-4 sm:pt-5 md:pt-6">
        <div
          ref={panelRef}
          className="mx-auto w-full max-w-[1120px] rounded-2xl bg-transparent box-border"
          style={{ padding: "0px 24px", height: panelHeight ? `${panelHeight}px` : "auto" }}
        >
          {/* hide inner scrollbar */}
          <style jsx>{`
            .inner-scroll { scrollbar-width: none; -ms-overflow-style: none; }
            .inner-scroll::-webkit-scrollbar { display: none; }
          `}</style>

          <div ref={scrollRef} className="inner-scroll h-full w-full overflow-y-auto">
            <div className="flex flex-col items-start text-start gap-5 sm:gap-6 md:gap-8 max-w-[820px] mx-auto">
              {/* Step label */}
              <div className="text-[11px] sm:text-[12px] md:text-[13px] text-[var(--muted)] font-medium">
                Step - 4
              </div>
              <div className="spacer-line w-[80%] self-start h-[1px] bg-[#d45427] mt-[-1%]" />

              {/* Heading + copy */}
              <div className="space-y-2.5 sm:space-y-3 max-w-[640px]">
                <h1 className="text-[16px] sm:text-[18px] md:text-[22px] lg:text-[26px] font-bold text-[var(--text)]">
                  Unlock high-impact keywords.
                </h1>
                <p className="text-[13px] sm:text-[14px] md:text-[15px] text-[var(--muted)] leading-relaxed">
                  I scanned your site and found these gems.
                </p>
              </div>

              {/* Keyword picker area — suggestions + inline More-input */}
              <div className="w-full max-w-[880px] space-y-6 sm:space-y-8">
                {/* Suggested pills */}
                <div className="flex flex-wrap justify-start gap-2.5 sm:gap-3">
                  {suggestedKeywords.map((keyword) => {
                    const isSelected = selectedKeywords.includes(keyword);

                    // Render “More” as inline input when toggled
                    if (keyword === "More" && showInlineMoreInput) {
                      return (
                        <div key="more-inline-input" className="flex items-center gap-2">
                          <input
                            ref={moreInputRef}
                            type="text"
                            placeholder="Add your own keyword"
                            value={customKeyword}
                            onChange={(e) => setCustomKeyword(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="px-3 sm:px-4 py-2 border border-[#d45427] rounded-xl bg-[var(--input)] text-[12px] sm:text-[13px] md:text-[14px] text-[var(--text)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[#d45427]"
                          />
                          <button
                            onClick={handleAddCustom}
                            disabled={!customKeyword.trim()}
                            type="button"
                            className="px-3 sm:px-4 py-2 bg-[image:var(--infoHighlight-gradient)] text-white rounded-xl hover:bg-gray-900 disabled:opacity-70 disabled:cursor-not-allowed transition-colors duration-200"
                            aria-label="Add custom keyword"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                      );
                    }

                    return (
                      <button
                        key={keyword}
                        onClick={() => handleKeywordToggle(keyword)}
                        type="button"
                        className={`px-3 sm:px-4 py-2 rounded-xl border text-[12px] sm:text-[13px] md:text-[14px] font-medium transition-all duration-200 ${
                          isSelected
                            ? "bg-[var(--input)] text-[var(--text)] border-[#d45427]"
                            : "bg-[var(--input)] text-[var(--muted)] border-[var(--border)] hover:bg-[var(--border)]"
                        }`}
                      >
                        {keyword}
                        {isSelected ? (
                          <ChevronDown size={16} className="inline ml-1 -rotate-180" />
                        ) : keyword !== "More" ? (
                          <Plus size={16} className="inline ml-1" />
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Selected keywords list */}
              {selectedKeywords.length > 0 && (
                <div className="w-full max-w-[820px]">
                  <h3 className="text-[13px] sm:text-[14px] md:text-[15px] font-medium text-[var(--text)] mb-3 sm:mb-4">
                    Selected Keywords ({selectedKeywords.length})
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedKeywords.map((keyword, idx) => (
                      <div
                        key={`${keyword}-${idx}`}
                        className="group relative inline-flex items-center rounded-xl font-medium bg-[image:var(--infoHighlight-gradient)] text-[12px] sm:text-[13px] md:text-[14px] text-white transition-all duration-300 px-4 sm:px-5 md:px-6 py-2.5 sm:py-3 cursor-default hover:pr-12"
                      >
                        <span>{keyword}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveKeyword(keyword);
                          }}
                          type="button"
                          className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 scale-50 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 text-[var(--input)] p-0 h-6 w-6 flex items-center justify-center pointer-events-auto"
                          title="Remove keyword"
                          aria-label={`Remove ${keyword}`}
                          tabIndex={-1}
                          style={{ background: "transparent", border: "none" }}
                        >
                          <X size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* System message / CTA (after summary) */}
              {showSummary && (
                <div className="max-w-[640px] text-left self-start mt-5 sm:mt-6">
                  <h3 className="text-[15px] sm:text-[16px] md:text-[18px] font-bold text-[var(--text)] mb-2.5 sm:mb-3">
                    Here’s your site report — take a quick look on the Info Tab.
                  </h3>
                  <p className="text-[12px] sm:text-[13px] md:text-[15px] text-[var(--muted)]">
                    If not, Want to do some changes?
                  </p>

                  <div className="flex items-center gap-8 sm:gap-10 mt-4 sm:mt-5 text-[12px] sm:text-[13px]">
                    <button
                      onClick={handleReset}
                      type="button"
                      className="text-[#d45427] hover:brightness-110 font-medium"
                    >
                      YES!
                    </button>
                  </div>
                </div>
              )}

              <div className="h-2" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar (matches StepSlide2/3) */}
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
