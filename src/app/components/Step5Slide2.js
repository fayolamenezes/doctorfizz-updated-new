"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import { ArrowLeft, ArrowRight, Briefcase, Languages, Tag } from "lucide-react";

export default function Step5Slide2({
  onBack,
  onDashboard,
  websiteData,
  businessData,
  languageLocationData,
  keywordData = [],
  competitorData = null,
}) {
  const [loading, setLoading] = useState(false);

  // ----- Fixed-height shell (match other slides) --------------------------------
  const panelRef = useRef(null);
  const scrollRef = useRef(null);
  const bottomBarRef = useRef(null);
  const loaderAnchorRef = useRef(null);
  const [panelHeight, setPanelHeight] = useState(null);
  const dashTimer = useRef(null);

  const recomputePanelHeight = () => {
    if (!panelRef.current) return;
    const vpH = window.innerHeight;
    const barH = bottomBarRef.current?.getBoundingClientRect().height ?? 0;
    const topOffset = panelRef.current.getBoundingClientRect().top;
    const guard = 24;
    const h = Math.max(360, vpH - barH - topOffset - guard);
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

  useEffect(() => recomputePanelHeight(), [loading]);

  // ----- Data shaping -----------------------------------------------------------
  const industry = businessData?.industry || "—";
  const category = businessData?.category || null;

  const langSel = useMemo(() => {
    if (languageLocationData?.selections?.length) {
      return languageLocationData.selections[0];
    }
    return { language: "English", location: "" };
  }, [languageLocationData]);

  const keywords = Array.isArray(keywordData) ? keywordData : [];

  const businessCompetitors = Array.isArray(competitorData?.businessCompetitors)
    ? competitorData.businessCompetitors
    : [];
  const searchCompetitors = Array.isArray(competitorData?.searchCompetitors)
    ? competitorData.searchCompetitors
    : [];

  // ----- Scroll loader into view once Dashboard is clicked ----------------------
  const scrollLoaderIntoView = () => {
    // best-effort smooth scroll (multiple nudges to win against reflows)
    const tryScroll = () => {
      // anchor-based precise scroll
      loaderAnchorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      // also push the inner scroller to bottom as a fallback
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    };

    // now + next tick + a short timeout to handle layout expansion
    tryScroll();
    requestAnimationFrame(tryScroll);
    setTimeout(tryScroll, 120);
  };

  const handleDashboard = () => {
    if (loading) return;
    setLoading(true);
    scrollLoaderIntoView();
    dashTimer.current = setTimeout(() => {
      // Now the dashboard is actually opening — close Info panel
      window.dispatchEvent(new Event("dashboard:open"));
      onDashboard?.();
    }, 6000);
  };

  useEffect(() => () => clearTimeout(dashTimer.current), []);

  // ----- Small UI helpers -------------------------------------------------------
  const Card = ({ icon, title, children }) => (
    <div className="rounded-2xl bg-[var(--input)] border border-[var(--border)] shadow-sm">
      <div className="flex items-center gap-2 px-6 pt-6 pb-3">
        <span className="text-[var(--muted)]">{icon}</span>
        <h3 className="text-[var(--text)] font-semibold">{title}</h3>
      </div>
      <div className="border-t border-[var(--border)]/70" />
      <div className="px-6 py-6">{children}</div>
    </div>
  );

  const Chip = ({ children }) => (
    <span className="inline-flex items-center rounded-full px-4 py-2 text-sm text-white bg-[image:var(--infoHighlight-gradient)] shadow-sm">
      {children}
    </span>
  );

  return (
    <div className="w-full h-full flex flex-col bg-transparent">
      {/* global utilities + loader/progress css */}
      <style jsx global>{`
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .no-scrollbar::-webkit-scrollbar { display: none; }

        .wave-loader { height: 46px; width: 46px; border-radius: 9999px; overflow: hidden;
          border: 2px solid #d45427; background: var(--input); position: relative; }
        .shine { position:absolute; top:2px; left:50%; transform:translateX(-50%); width:72%; height:26%;
          border-radius:0 0 9999px 9999px;
          background: radial-gradient(ellipse at 50% 0%, rgba(255,255,255,.96), rgba(255,255,255,.2) 70%, transparent 80%);
          pointer-events:none; z-index:3; }
        .layer { position:absolute; inset:0; bottom:-2px; height:120%; transform:translateY(20%); }
        .seg { position:absolute; left:0; bottom:0; width:200%; height:140%; }
        .seg.clone { left:200%; }
        @keyframes drift { 0% { transform: translate(0, 20%); } 100% { transform: translate(-200%, 20%); } }
        .layer-back { opacity:.92; animation: drift 6.8s linear infinite; }
        .layer-front { opacity:.98; animation: drift 5.6s linear infinite; }

        /* progress */
        .progress-wrap { position:relative; height:10px; width:100%; border-radius:9999px; background: var(--border); overflow:hidden; }
        .progress-track {
          position:absolute; inset:0;
          background: linear-gradient(90deg, #d45427 0%, #ffa615 100%);
          transform: translateX(-60%);
          animation: slide 2.2s cubic-bezier(.37,.01,.22,1) infinite;
        }
        @keyframes slide { 0% { transform: translateX(-60%); } 50% { transform: translateX(10%); } 100% { transform: translateX(120%); } }
        .progress-shine {
          position:absolute; top:0; bottom:0; width:30%;
          background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,.65) 50%, transparent 100%);
          filter: blur(8px);
          animation: shine 1.6s linear infinite;
        }
        @keyframes shine { 0% { left: -30%; } 100% { left: 130%; } }
      `}</style>

      {/* ---------------- Fixed-height content area ---------------- */}
      <div className="px-6 md:px-8 pt-6">
        <div
          ref={panelRef}
          className="mx-auto w-full max-w-[1120px] rounded-2xl bg-transparent"
          style={{ padding: "0px 24px", height: panelHeight ? `${panelHeight}px` : "auto" }}
        >
          <div ref={scrollRef} className="no-scrollbar h-full w-full overflow-y-auto">
            <div className="max-w-[1120px] mx-auto pt-8">
              {/* Title */}
              <div className="text-center">
                <h1 className="text-3xl md:text-4xl font-bold text-[var(--text)]">Great! You’re all done.</h1>
                <p className="mt-2 text-[var(--muted)]">
                  Here is your <span className="font-semibold">entire report</span> based on your input.
                </p>
              </div>

              {/* Cards */}
              <div className="mt-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                <Card icon={<Briefcase size={18} />} title="Business Selected">
                  <div className="space-y-4">
                    <div className="text-[var(--muted)]">{industry}</div>
                    {category && <Chip>{String(category)}</Chip>}
                  </div>
                </Card>

                <Card icon={<Languages size={18} />} title="Language Selected">
                  <div className="space-y-4">
                    <div className="text-[var(--muted)]">{langSel.language || "English"}</div>
                    {langSel.location && <Chip>{String(langSel.location)}</Chip>}
                  </div>
                </Card>

                <Card icon={<Tag size={18} />} title="Keywords Selected">
                  <div className="flex flex-wrap gap-2">
                    {keywords.length ? (
                      keywords.map((k, i) => <Chip key={i}>{String(k)}</Chip>)
                    ) : (
                      <span className="text-[var(--muted)] text-sm">No keywords selected</span>
                    )}
                  </div>
                </Card>

                <Card icon={<Briefcase size={18} />} title="Competitors">
                  <div className="space-y-5">
                    <div>
                      <div className="text-[12px] tracking-wide font-semibold text-[var(--muted)]">
                        BUSINESS COMPETITORS
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {businessCompetitors.length ? (
                          businessCompetitors.map((c, i) => <Chip key={`biz-${i}`}>{String(c)}</Chip>)
                        ) : (
                          <span className="text-[var(--muted)] text-sm">None selected</span>
                        )}
                      </div>
                    </div>

                    <div className="border-t border-[var(--border)] my-1" />

                    <div>
                      <div className="text-[12px] tracking-wide font-semibold text-[var(--muted)]">
                        SEARCH ENGINE COMPETITORS
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {searchCompetitors.length ? (
                          searchCompetitors.map((c, i) => <Chip key={`sea-${i}`}>{String(c)}</Chip>)
                        ) : (
                          <span className="text-[var(--muted)] text-sm">None selected</span>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Anchor to scroll to when showing loader */}
              <div ref={loaderAnchorRef} className="mt-6" />

              {/* Loader (appears after Dashboard click) */}
              {loading && (
                <div className="mt-8 flex flex-col items-center">
                  <p className="text-[var(--muted)]">Great things take time!</p>
                  <p className="text-[var(--muted)]">
                    Preparing your <span className="font-semibold">Dashboard</span>.
                  </p>

                  {/* Wave */}
                  <div className="mt-6 wave-loader">
                    <div className="shine" />
                    <div className="layer layer-back">
                      <svg viewBox="0 0 200 60" preserveAspectRatio="none" className="seg">
                        <defs>
                          <linearGradient id="inkBack" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%">
                              <animate attributeName="stop-color" values="#d45427;#ffa615;#d45427" dur="6s" repeatCount="indefinite" />
                            </stop>
                            <stop offset="100%">
                              <animate attributeName="stop-color" values="#ffa615;#d45427;#ffa615" dur="6s" repeatCount="indefinite" />
                            </stop>
                          </linearGradient>
                        </defs>
                        <path d="M0 30 Q 25 22 50 30 T 100 30 T 150 30 T 200 30 V60 H0 Z" fill="url(#inkBack)" />
                      </svg>
                      <svg viewBox="0 0 200 60" preserveAspectRatio="none" className="seg clone">
                        <defs>
                          <linearGradient id="inkBack2" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%">
                              <animate attributeName="stop-color" values="#d45427;#ffa615;#d45427" dur="6s" repeatCount="indefinite" />
                            </stop>
                            <stop offset="100%">
                              <animate attributeName="stop-color" values="#ffa615;#d45427;#ffa615" dur="6s" repeatCount="indefinite" />
                            </stop>
                          </linearGradient>
                        </defs>
                        <path d="M0 30 Q 25 22 50 30 T 100 30 T 150 30 T 200 30 V60 H0 Z" fill="url(#inkBack2)" />
                      </svg>
                    </div>

                    <div className="layer layer-front">
                      <svg viewBox="0 0 200 60" preserveAspectRatio="none" className="seg">
                        <defs>
                          <linearGradient id="inkFront" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%">
                              <animate attributeName="stop-color" values="#ffa615;#d45427;#ffa615" dur="5s" repeatCount="indefinite" />
                            </stop>
                            <stop offset="100%">
                              <animate attributeName="stop-color" values="#d45427;#ffa615;#d45427" dur="5s" repeatCount="indefinite" />
                            </stop>
                          </linearGradient>
                        </defs>
                        <path d="M0 30 Q 25 18 50 30 T 100 30 T 150 30 T 200 30 V60 H0 Z" fill="url(#inkFront)" />
                      </svg>
                      <svg viewBox="0 0 200 60" preserveAspectRatio="none" className="seg clone">
                        <defs>
                          <linearGradient id="inkFront2" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%">
                              <animate attributeName="stop-color" values="#ffa615;#d45427;#ffa615" dur="5s" repeatCount="indefinite" />
                            </stop>
                            <stop offset="100%">
                              <animate attributeName="stop-color" values="#d45427;#ffa615;#d45427" dur="5s" repeatCount="indefinite" />
                            </stop>
                          </linearGradient>
                        </defs>
                        <path d="M0 30 Q 25 18 50 30 T 100 30 T 150 30 T 200 30 V60 H0 Z" fill="url(#inkFront2)" />
                      </svg>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="mt-6 w-full max-w-[560px]">
                    <div className="progress-wrap">
                      <div className="progress-track" />
                      <div className="progress-shine" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ---------------- Bottom bar ---------------- */}
      <div ref={bottomBarRef} className="flex-shrink-0 bg-transparent">
        <div className="border-t border-[var(--border)]" />
        <div className="mx-auto w-full max-w-[1120px] px-6 md:px-8">
          <div className="py-7 flex justify-center gap-4">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 rounded-full bg-[var(--input)] px-6 py-3 text-[var(--text)] hover:bg-[var(--input)] shadow-sm border border-[#d45427]"
            >
              <ArrowLeft size={16} /> Back
            </button>
            {!loading && (
              <button
                onClick={handleDashboard}
                className="inline-flex items-center gap-2 rounded-full bg-[image:var(--infoHighlight-gradient)] px-8 py-3 text-white hover:opacity-90 shadow-sm"
              >
                Dashboard <ArrowRight size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
