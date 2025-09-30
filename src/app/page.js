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

  // src/app/page.js
  const handleWebsiteSubmit = useCallback((website) => {
    // existing normalization
    let cleanWebsite = website.toLowerCase();
    if (cleanWebsite.startsWith("http://")) cleanWebsite = cleanWebsite.replace("http://", "");
    if (cleanWebsite.startsWith("https://")) cleanWebsite = cleanWebsite.replace("https://", "");
    if (cleanWebsite.startsWith("www.")) cleanWebsite = cleanWebsite.replace("www.", "");

    // save for InfoPanel
    setWebsiteData({ website: cleanWebsite, submittedAt: new Date() });

    // 👇 new lines: open and pin the Info panel right away
    setIsInfoOpen(true);
    setIsPinned(true);
  }, []);

  const handleBusinessDataSubmit = useCallback((business) => {
    setBusinessData(business);
  }, []);

  const handleLanguageLocationSubmit = useCallback((data) => {
    setLanguageLocationData(data);
  }, []);

  const handleKeywordSubmit = useCallback((data) => {
    setSelectedKeywords(data.keywords);
  }, []);

  const handleCompetitorSubmit = useCallback((data) => {
    setCompetitorData(
      data || { businessCompetitors: [], searchCompetitors: [], totalCompetitors: [] }
    );
  }, []);

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
            onDashboard={() => setCurrentStep("dashboard")}   // switches after loading
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

  const mainOffsetClass = isInfoOpen || isPinned ? "ml-[510px]" : "ml-[80px]"; // 510 = 80 + 430

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

      {/* FLEX COLUMN ROOT — min-h-0 lets the child scroll */}
      <main className={`flex-1 flex flex-col min-h-0 transition-all duration-300 ${mainOffsetClass}`}>
        {/* Steps header (hidden on 5b & dashboard) */}
        {currentStep !== "5b" && currentStep !== "dashboard" && (
          <div className="w-full flex justify-center">
            <div className="max-w-[100%] w-full rounded-tr-2xl rounded-tl-2xl px-6 bg-[var(--bg-panel)] py-6">
              <Steps currentStep={currentStep === "5b" ? 5 : currentStep} />
            </div>
          </div>
        )}

        {/* HOST PANEL — the only scroll container */}
        <div className="flex-1 h-full flex justify-center items-start no-scrollbar">
        <style jsx global>{`
        .no-scrollbar {
          -ms-overflow-style: none; /* IE & Edge */
          scrollbar-width: none; /* Firefox */
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none; /* Chrome, Safari, Opera */
        }
      `}</style>
         <div
  className={`relative flex-1 h-full bg-[var(--bg-panel)] shadow-sm 
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
