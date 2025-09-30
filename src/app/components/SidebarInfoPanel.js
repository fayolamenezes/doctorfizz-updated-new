"use client";

import React, { forwardRef } from "react";
import Sidebar from "./Sidebar";
import InfoPanel from "./InfoPanel";

export const SIDEBAR_WIDTH_PX = 80;
export const INFOPANEL_WIDTH_PX = 430;

const SidebarInfoPanel = forwardRef(function SidebarInfoPanel(
  {
    // sidebar
    onInfoClick,
    infoActive,
    // info panel
    isOpen,
    isPinned,
    setIsPinned,
    websiteData,
    businessData,
    languageLocationData,
    keywordData,
    competitorData,
    currentStep,
    onClose,
  },
  ref
) {
  return (
    <>
      <Sidebar onInfoClick={onInfoClick} infoActive={infoActive} />
      <InfoPanel
        ref={ref}
        isOpen={isOpen}
        isPinned={isPinned}
        setIsPinned={setIsPinned}
        websiteData={websiteData}
        businessData={businessData}
        languageLocationData={languageLocationData}
        keywordData={keywordData}
        competitorData={competitorData}
        currentStep={currentStep}
        onClose={onClose}
      />
    </>
  );
});

export default SidebarInfoPanel;
