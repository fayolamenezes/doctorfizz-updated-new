"use client";

import { useState, useEffect, useRef } from "react";
import { ArrowRight, ArrowLeft, ChevronDown, Plus } from "lucide-react";

export default function StepSlide3({ onNext, onBack, onLanguageLocationSubmit }) {
  // selections
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [addedSelections, setAddedSelections] = useState([]);

  // UI state
  const [showSummary, setShowSummary] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  // fixed height like Step1Slide1 / FINAL StepSlide2
  const panelRef = useRef(null);      // outer rounded panel
  const scrollRef = useRef(null);     // inner scroll region
  const bottomBarRef = useRef(null);  // bottom CTA area
  const [panelHeight, setPanelHeight] = useState(null);

  // submit guard
  const lastSubmittedData = useRef(null);

  const languages = [
    "English","Spanish","French","German","Italian","Portuguese",
    "Chinese (Mandarin)","Japanese","Korean","Hindi","Bengali","Russian",
    "Arabic","Turkish","Vietnamese","Polish","Persian","Dutch","Thai",
    "Swedish","Norwegian","Finnish","Danish","Czech","Hungarian","Greek",
    "Romanian","Ukrainian","Hebrew","Malay/Indonesian","Filipino/Tagalog"
  ];

  const locations = [
    "United States","Canada","Mexico","United Kingdom","Germany","France","Italy","Spain","Netherlands",
    "Sweden","Norway","Denmark","Finland","Poland","Czech Republic","Switzerland","Belgium","Austria",
    "Ireland","Portugal","Greece","Russia","Ukraine","Romania","Hungary","China","India","Japan",
    "South Korea","Singapore","Hong Kong","Taiwan","Indonesia","Malaysia","Thailand","Vietnam",
    "Philippines","Israel","Turkey","United Arab Emirates","Saudi Arabia","Qatar","South Africa",
    "Egypt","Nigeria","Morocco","Kenya","Australia","New Zealand","Brazil","Argentina","Chile",
    "Colombia","Peru","Bangalore","Mumbai","Delhi","California","New York","London","Paris","Berlin"
  ];

  /* ---------------- Fixed panel height (same approach as final StepSlide2) ---------------- */
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
  }, [showSummary, addedSelections.length]);

  /* ---------------- Selections / Submission ---------------- */
  const handleAdd = () => {
    const lang = selectedLanguage || "Other";
    const loc  = selectedLocation  || "Other";
    const entry = { id: Date.now(), language: lang, location: loc };
    setAddedSelections((prev) => [...prev, entry]);
    setSelectedLanguage("");
    setSelectedLocation("");
    setOpenDropdown(null);
  };

  useEffect(() => {
    if (addedSelections.length) {
      const payload = { selections: addedSelections };
      const now = JSON.stringify(payload);
      if (now !== JSON.stringify(lastSubmittedData.current)) {
        lastSubmittedData.current = payload;
        onLanguageLocationSubmit?.(payload);
      }
      setShowSummary(true);
    } else {
      setShowSummary(false);
    }
  }, [addedSelections, onLanguageLocationSubmit]);

  // scroll to top when summary appears (like StepSlide2)
  useEffect(() => {
    if (scrollRef.current && showSummary) {
      scrollRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [showSummary]);

  /* ---------------- Handlers ---------------- */
  const handleNext = () => onNext?.();
  const handleBack = () => onBack?.();

  const handleDropdownToggle = (name) => {
    setOpenDropdown((prev) => (prev === name ? null : name));
  };

  const handleReset = () => {
    setAddedSelections([]);
    setSelectedLanguage("");
    setSelectedLocation("");
    lastSubmittedData.current = null;
    setShowSummary(false);
  };

  // close dropdowns if clicked outside
  useEffect(() => {
    const onDocClick = (e) => {
      if (!e.target.closest(".dropdown-container")) setOpenDropdown(null);
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  return (
    <div className="w-full h-full flex flex-col bg-transparent slides-accent">
      {/* ---------------- Fixed-height section (matches StepSlide2 final) ---------------- */}
      <div className="px-6 md:px-8 pt-6">
        <div
          ref={panelRef}
          className="mx-auto w-full max-w-[1120px] rounded-2xl bg-transparent"
          style={{ padding: "0px 24px", height: panelHeight ? `${panelHeight}px` : "auto" }}
        >
          {/* hide inner scrollbar cross-browser */}
          <style jsx>{`
            .inner-scroll { scrollbar-width: none; -ms-overflow-style: none; }
            .inner-scroll::-webkit-scrollbar { display: none; }
          `}</style>

          {/* Inner scrollable */}
          <div ref={scrollRef} className="inner-scroll h-full w-full overflow-y-auto">
            <div className="flex flex-col items-start text-start gap-6 max-w-[820px] mx-auto">
              {/* Step label */}
              <div className="text-[var(--muted)] text-sm font-medium">Step - 3</div>
<div className="spacer-line w-[80%] self-start h-[1px] bg-[#d45427] mt-[-1%]"></div>
              {/* Heading & copy (same scale as StepSlide2 final) */}
              <div className="space-y-4 max-w-[640px]">
                <h1 className="text-[22px] md:text-[26px] font-bold text-[var(--text)]">
                  Select the languages and locations relevant to your business
                </h1>
                <p className="text-[15px] text-[var(--muted)] leading-relaxed">
                  Choose your language & business locations. Select at least one country to localise your analysis.
                </p>
              </div>

              {/* Right-aligned “summary bubble(s)” (like StepSlide2) */}
              {showSummary && (
                <div className="w-full self-end flex flex-col items-end gap-2">
                  {addedSelections.map((s) => (
                    <div
                      key={s.id}
                      className="bg-[var(--input)] max-w-[340px] w-full rounded-2xl shadow-sm border border-[var(--border)] px-6 py-4 text-left text-[15px]"
                    >
                      <div className="text-[var(--text)]">
                        <span className="font-semibold">Language:</span> {s.language}
                      </div>
                      <div className="text-[var(--text)]">
                        <span className="font-semibold">Location:</span> {s.location}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Pickers (when not summarized) */}
              {!showSummary && (
                <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-6 w-full max-w-[880px] relative pb-64">
                  {/* Language */}
                  <div
                    className="relative dropdown-container overflow-visible"
                    style={{ zIndex: openDropdown === "lang" ? 1000 : 1 }}
                  >
                    <button
                      onClick={() => handleDropdownToggle("lang")}
                      type="button"
                      className="w-full bg-[var(--input)] border border-[var(--border)] rounded-lg px-4 py-3 text-left flex items-center justify-between hover:border-[var(--border)] focus:outline-none focus:border-[var(--border)] transition-colors"
                    >
                      <span className={selectedLanguage ? "text-[var(--text)]" : "text-[var(--muted)]"}>
                        {selectedLanguage || "Select Language"}
                      </span>
                      <ChevronDown
                        size={20}
                        className={`transition-transform ${openDropdown === "lang" ? "rotate-180" : ""}`}
                      />
                    </button>

                    {openDropdown === "lang" && (
                      <div className="absolute top-full left-0 right-0 bg-[var(--input)] border border-[var(--border)] rounded-lg mt-1 shadow-2xl max-h-64 overflow-y-auto z-20">
                        {languages.map((l) => (
                          <button
                            key={l}
                            onClick={() => { setSelectedLanguage(l); setOpenDropdown(null); }}
                            type="button"
                            className="w-full text-left px-4 py-3 hover:bg-[var(--menuHover)] focus:bg-[var(--menuFocus)] text-[var(--text)] border-b border-[var(--border)] last:border-b-0 focus:outline-none transition-colors"
                          >
                            {l}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Location */}
                  <div
                    className="relative dropdown-container overflow-visible"
                    style={{ zIndex: openDropdown === "loc" ? 1000 : 1 }}
                  >
                    <button
                      onClick={() => handleDropdownToggle("loc")}
                      type="button"
                      className="w-full bg-[var(--input)] border border-[var(--border)] rounded-lg px-4 py-3 text-left flex items-center justify-between hover:border-[var(--border)] focus:outline-none focus:border-[var(--border)] transition-colors"
                    >
                      <span className={selectedLocation ? "text-[var(--text)]" : "text-[var(--muted)]"}>
                        {selectedLocation || "Select Location"}
                      </span>
                      <ChevronDown
                        size={20}
                        className={`transition-transform ${openDropdown === "loc" ? "rotate-180" : ""}`}
                      />
                    </button>

                    {openDropdown === "loc" && (
                      <div className="absolute top-full left-0 right-0 bg-[var(--input)] border border-[var(--border)] rounded-lg mt-1 shadow-2xl max-h-64 overflow-y-auto z-20">
                        {locations.map((c) => (
                          <button
                            key={c}
                            onClick={() => { setSelectedLocation(c); setOpenDropdown(null); }}
                            type="button"
                            className="w-full text-left px-4 py-3 hover:bg-[var(--menuHover)] focus:bg-[var(--menuFocus)] text-[var(--text)] border-b border-[var(--border)] last:border-b-0 focus:outline-none transition-colors"
                          >
                            {c}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Add button */}
                  <div className="flex items-stretch">
                    <button
                      onClick={handleAdd}
                      type="button"
                      className="w-full md:w-auto bg-[image:var(--infoHighlight-gradient)]  rounded-lg px-6 py-3 flex items-center justify-center gap-2 text-[var(--input)]"
                    >
                      <Plus size={16} />
                      <span>Add</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Left-aligned system message (same copy/format as final StepSlide2) */}
              {showSummary && (
                <div className="max-w-[640px] text-left self-start">
                  <h3 className="text-[18px] font-bold text-[var(--text)] mb-3">
                    Here’s your site report — take a quick look on the Info Tab.
                  </h3>
                  <p className="text-[15px] text-[var(--muted)] mt-2">
                    If not, Want to do some changes?
                  </p>

                  <div className="flex items-center gap-12 mt-6 text-[14px]">
                    {/* In StepSlide2 final you kept ONLY the positive action */}
                    <button
                      onClick={handleReset}
                      className="text-[#d45427] hover:brightness-110 font-medium"
                      type="button"
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

      {/* ---------------- Bottom bar (identical styling to final StepSlide2) ---------------- */}
      <div ref={bottomBarRef} className="flex-shrink-0 bg-transparent">
        <div className="border-t border-[var(--border)]" />
        <div className="mx-auto w-full max-w-[1120px] px-6 md:px-8">
          <div className="py-7 flex justify-center gap-4">
            <button
              onClick={handleBack}
              type="button"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--input)] px-6 py-3 text-[var(--text)] hover:bg-[var(--input)] shadow-sm border border-[#d45427]"
            >
              <ArrowLeft size={16} /> Back
            </button>

            {showSummary && (
              <button
                onClick={handleNext}
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
