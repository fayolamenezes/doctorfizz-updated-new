"use client";

import { useState, useEffect, useRef } from "react";
import { ArrowRight, ArrowLeft, ChevronDown, Plus, X } from "lucide-react";

export default function StepSlide4({ onNext, onBack, onKeywordSubmit }) {
  /* ---------------- State ---------------- */
  const [selectedKeywords, setSelectedKeywords] = useState([]);
  const [customKeyword, setCustomKeyword] = useState("");
  const [showSummary, setShowSummary] = useState(false);

  // NEW: control inline “More → input”
  const [showInlineMoreInput, setShowInlineMoreInput] = useState(false);
  const moreInputRef = useRef(null);

  // fixed-height shell like StepSlide2/3 final
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

  /* ---------------- Fixed panel height (same as StepSlide2/3) ---------------- */
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
    // “More” does not toggle selection — it reveals the inline input instead
    if (keyword === "More") {
      setShowInlineMoreInput(true);
      // focus input shortly after render
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
      // keep the inline input visible so user can add multiple, as discussed
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
    <div className="w-full h-full flex flex-col bg-transparent">
      {/* Fixed-height white section (matches StepSlide2/3 final) */}
      <div className="px-6 md:px-8 pt-6">
        <div
          ref={panelRef}
          className="mx-auto w-full max-w-[1120px] rounded-2xl bg-transparent"
          style={{ padding: "0px 24px", height: panelHeight ? `${panelHeight}px` : "auto" }}
        >
          {/* hide inner scrollbar */}
          <style jsx>{`
            .inner-scroll { scrollbar-width: none; -ms-overflow-style: none; }
            .inner-scroll::-webkit-scrollbar { display: none; }
          `}</style>

          <div ref={scrollRef} className="inner-scroll h-full w-full overflow-y-auto">
            <div className="flex flex-col items-start text-start gap-6 max-w-[820px] mx-auto">
              {/* Step label */}
              <div className="text-[var(--muted)] text-sm font-medium">Step - 4</div>
<div className="spacer-line w-[80%] self-start h-[1px] bg-[#d45427] mt-[-1%]"></div>
              {/* Heading + copy */}
              <div className="space-y-4 max-w-[640px]">
                <h1 className="text-[22px] md:text-[26px] font-bold text-[var(--text)]">
                  Unlock high-impact keywords.
                </h1>
                <p className="text-[15px] text-[var(--muted)] leading-relaxed">
                  I scanned your site and found these gems.
                </p>
              </div>

              {/* Keyword picker area — suggestions + inline More-input */}
              <div className="w-full max-w-[880px] space-y-8">
                {/* Suggested pills */}
                <div className="flex flex-wrap justify-start gap-3">
                  {suggestedKeywords.map((keyword) => {
                    const isSelected = selectedKeywords.includes(keyword);

                    // Render “More” as inline input when toggled
                    if (keyword === "More" && showInlineMoreInput) {
                      return (
                        <div
                          key="more-inline-input"
                          className="flex items-center gap-2"
                        >
                          <input
                            ref={moreInputRef}
                            type="text"
                            placeholder="Add your own keyword"
                            value={customKeyword}
                            onChange={(e) => setCustomKeyword(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="px-4 py-2 border border-[#d45427] rounded-xl bg-[var(--input)] text-[var(--text)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[#d45427] text-sm"
                          />
                          <button
                            onClick={handleAddCustom}
                            disabled={!customKeyword.trim()}
                            type="button"
                            className="px-4 py-2 bg-[image:var(--infoHighlight-gradient)] text-white rounded-xl hover:bg-gray-900 disabled:opacity-70 disabled:cursor-not-allowed transition-colors duration-200"
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
                        className={`px-4 py-2 rounded-xl border text-sm font-medium transition-all duration-200 ${
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

                {/* The separate custom input block is intentionally hidden now.
                    We only show the input when the user clicks “More”, which
                    transforms the “More” pill itself into the input above. */}
              </div>

              {/* Selected keywords list */}
              {selectedKeywords.length > 0 && (
                <div className="w-full max-w-[820px]">
                  <h3 className="text-md font-medium text-[var(--text)] mb-4">
                    Selected Keywords ({selectedKeywords.length})
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedKeywords.map((keyword, idx) => (
                      <div
                        key={`${keyword}-${idx}`}
                        className="group relative inline-flex items-center text-[#fff] rounded-xl font-medium bg-[image:var(--infoHighlight-gradient)] text-sm transition-all duration-300 px-6 py-3 cursor-default hover:pr-12"
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

              {/* Left-aligned system message */}
              {showSummary && (
                <div className="max-w-[640px] text-left self-start mt-6">
                  <h3 className="text-[18px] font-bold text-[var(--text)] mb-3">
                    Here’s your site report — take a quick look on the Info Tab.
                  </h3>
                  <p className="text-[15px] text-[var(--muted)] mt-2">
                    If not, Want to do some changes?
                  </p>

                  <div className="flex items-center gap-12 mt-6 text-[14px]">
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

      {/* Bottom bar (same styling as StepSlide2/3) */}
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
