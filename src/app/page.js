"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Steps from "./components/Steps";
import Step1Slide1 from "./components/Step1Slide1";
import StepSlide2 from "./components/StepSlide2";
import StepSlide3 from "./components/StepSlide3";
import StepSlide4 from "./components/StepSlide4";
import StepSlide5 from "./components/StepSlide5";
import Step5Slide2 from "./components/Step5Slide2";
import ThemeToggle from "./components/ThemeToggle";
import SidebarInfoPanel from "./components/SidebarInfoPanel";
import Dashboard from "./components/Dashboard";

/* ---------- Mobile-only compact steps: 3 / 2 with dotted connectors ---------- */
function MobileStepsThreeTwo({ currentStep }) {
  const active = typeof currentStep === "number" ? currentStep : 5;

  const Dot = ({ n }) => {
    const state = n === active ? "active" : n < active ? "complete" : "idle";
    const cls =
      state === "active"
        ? "bg-[image:var(--infoHighlight-gradient)] text-white"
        : state === "complete"
        ? "bg-gray-700 text-white"
        : "bg-gray-200 text-gray-600";
    return (
      <div
        className={`h-7 w-7 rounded-full grid place-items-center text-[11px] font-semibold ${cls}`}
        aria-current={n === active ? "step" : undefined}
        aria-label={`Step ${n} of 5`}
      >
        {n}
      </div>
    );
  };

  // true circular dotted connector (mobile)
  const DottedConnector = ({ size = 3, count = 5, color = "bg-gray-300/90" }) => (
    <div className="flex items-center justify-center shrink-0 gap-1.5" aria-hidden>
      {Array.from({ length: count }).map((_, i) => (
        <span key={i} className={`block rounded-full ${color}`} style={{ width: size, height: size }} />
      ))}
    </div>
  );

  const Row3 = ({ a, b, c }) => (
    <div className="flex items-center justify-center gap-2">
      <Dot n={a} />
      <DottedConnector />
      <Dot n={b} />
      <DottedConnector />
      <Dot n={c} />
    </div>
  );

  const Row2 = ({ a, b }) => (
    <div className="flex items-center justify-center gap-2">
      <Dot n={a} />
      <DottedConnector />
      <Dot n={b} />
    </div>
  );

  return (
    <div className="sm:hidden w-full bg-[var(--bg-panel)] rounded-tl-2xl rounded-tr-2xl pt-10 pb-2 px-3">
      <div className="mx-auto w-fit space-y-6">
        <Row3 a={1} b={2} c={3} />
        <Row2 a={4} b={5} />
      </div>
    </div>
  );
}

export default function Home() {
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const [websiteData, setWebsiteData] = useState(null);
  const [businessData, setBusinessData] = useState(null);
  const [languageLocationData, setLanguageLocationData] = useState(null);
  const [selectedKeywords, setSelectedKeywords] = useState([]);
  const [competitorData, setCompetitorData] = useState(null);

  const infoRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        infoRef.current &&
        !infoRef.current.contains(event.target) &&
        !event.target.closest("#sidebar-info-btn") &&
        !isPinned
      ) {
        setIsInfoOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isPinned]);

  const handleNextStep = () => {
    if (currentStep === 5) {
      setCurrentStep("5b");
      return;
    }
    if (typeof currentStep === "number" && currentStep < 5) {
      setCurrentStep((s) => s + 1);
    }
  };

  const handleBackStep = () => {
    if (currentStep === "5b") {
      setCurrentStep(5);
      return;
    }
    if (typeof currentStep === "number" && currentStep > 1) {
      setCurrentStep((s) => s - 1);
    }
  };

  // keep your original submit behavior; InfoPanel.js already ensures "pin only on desktop"
  const handleWebsiteSubmit = useCallback((website) => {
    let cleanWebsite = website.toLowerCase();
    if (cleanWebsite.startsWith("http://")) cleanWebsite = cleanWebsite.replace("http://", "");
    if (cleanWebsite.startsWith("https://")) cleanWebsite = cleanWebsite.replace("https://", "");
    if (cleanWebsite.startsWith("www.")) cleanWebsite = cleanWebsite.replace("www.", "");
    setWebsiteData({ website: cleanWebsite, submittedAt: new Date() });

    setIsInfoOpen(true);
    setIsPinned(true); // fine to keep; small screens won't shift because we only offset on lg+
  }, []);

  const handleBusinessDataSubmit = useCallback((business) => setBusinessData(business), []);
  const handleLanguageLocationSubmit = useCallback((data) => setLanguageLocationData(data), []);
  const handleKeywordSubmit = useCallback((data) => setSelectedKeywords(data.keywords), []);
  const handleCompetitorSubmit = useCallback(
    (data) =>
      setCompetitorData(
        data || { businessCompetitors: [], searchCompetitors: [], totalCompetitors: [] }
      ),
    []
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1Slide1 onNext={handleNextStep} onWebsiteSubmit={handleWebsiteSubmit} />;
      case 2:
        return (
          <StepSlide2
            onNext={handleNextStep}
            onBack={handleBackStep}
            onBusinessDataSubmit={handleBusinessDataSubmit}
          />
        );
      case 3:
        return (
          <StepSlide3
            onNext={handleNextStep}
            onBack={handleBackStep}
            onLanguageLocationSubmit={handleLanguageLocationSubmit}
          />
        );
      case 4:
        return (
          <StepSlide4
            onNext={handleNextStep}
            onBack={handleBackStep}
            onKeywordSubmit={handleKeywordSubmit}
          />
        );
      case 5:
        return (
          <StepSlide5
            onNext={handleNextStep}
            onBack={handleBackStep}
            onCompetitorSubmit={handleCompetitorSubmit}
          />
        );
      case "5b":
        return (
          <Step5Slide2
            onBack={() => setCurrentStep(5)}
            onDashboard={() => setCurrentStep("dashboard")}
            businessData={businessData}
            languageLocationData={languageLocationData}
            keywordData={selectedKeywords}
            competitorData={competitorData}
          />
        );
      case "dashboard":
        return <Dashboard />;
      default:
        return <Step1Slide1 onNext={handleNextStep} onWebsiteSubmit={handleWebsiteSubmit} />;
    }
  };

  // ✅ Only desktop shifts left when the info panel is open/pinned.
  // Phones/tablets always keep just the rail margin beside the sidebar.
  const mainOffsetClass =
    isInfoOpen || isPinned
      ? "ml-[56px] md:ml-[72px] lg:ml-[510px]"
      : "ml-[56px] md:ml-[72px] lg:ml-[80px]";

  return (
    <div className="flex h-screen overflow-hidden bg-[image:var(--brand-gradient)] bg-no-repeat bg-[size:100%_100%] p-3">
      <SidebarInfoPanel
        ref={infoRef}
        onInfoClick={() => {
          if (isPinned) return;
          setIsInfoOpen((prev) => !prev);
        }}
        infoActive={isInfoOpen || isPinned}
        isOpen={isInfoOpen}
        isPinned={isPinned}
        setIsPinned={setIsPinned}
        websiteData={websiteData}
        businessData={businessData}
        languageLocationData={languageLocationData}
        keywordData={selectedKeywords}
        competitorData={competitorData}
        currentStep={currentStep === "5b" ? 5 : currentStep}
        onClose={() => setIsInfoOpen(false)}
      />

      <ThemeToggle />

      {/* FLEX COLUMN ROOT */}
      <main className={`flex-1 min-w-0 flex flex-col min-h-0 transition-all duration-300 ${mainOffsetClass}`}>
        {/* Steps header (hidden on 5b & dashboard) */}
        {currentStep !== "5b" && currentStep !== "dashboard" && (
          <>
            {/* Mobile: 3 / 2 steps – centered, dotted connectors, lowered */}
            <MobileStepsThreeTwo currentStep={currentStep} />

            {/* Tablet/Desktop: original full Steps bar */}
            <div className="hidden sm:flex w-full justify-center">
              <div
                className="
                  max-w-[100%] w-full rounded-tr-2xl rounded-tl-2xl
                  px-5 md:px-6 py-5 md:py-6 bg-[var(--bg-panel)]
                  text-sm md:text-base
                  overflow-hidden
                "
              >
                <div className="flex justify-center">
                  <Steps currentStep={currentStep === "5b" ? 5 : currentStep} />
                </div>
              </div>
            </div>
          </>
        )}

        {/* HOST PANEL — the only scroll container */}
        <div className="flex-1 min-w-0 h-full flex justify-center items-start no-scrollbar">
          <style jsx global>{`
            .no-scrollbar {
              -ms-overflow-style: none; /* IE & Edge */
              scrollbar-width: none;    /* Firefox */
            }
            .no-scrollbar::-webkit-scrollbar {
              display: none;            /* Chrome, Safari, Opera */
            }
          `}</style>

          <div
            className={`relative flex-1 min-w-0 h-full bg-[var(--bg-panel)] shadow-sm 
              ${currentStep === "dashboard" || currentStep === "5b" ? "rounded-2xl" : "rounded-bl-2xl rounded-br-2xl"} 
              overflow-y-scroll overscroll-contain no-scrollbar`}
          >
            {renderCurrentStep()}
          </div>
        </div>
      </main>
    </div>
  );
}
