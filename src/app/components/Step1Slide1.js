"use client";
import { useState, useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";

export default function Step1Slide1({ onNext, onWebsiteSubmit }) {
  const [site, setSite] = useState("");
  const [messages, setMessages] = useState([]);
  const [currentState, setCurrentState] = useState("initial"); // initial | submitted | confirmed
  const [error, setError] = useState("");
  const [wavePhase, setWavePhase] = useState(0);
  const [isShaking, setIsShaking] = useState(true);

  const [showInput, setShowInput] = useState(true);

  const panelRef = useRef(null);
  const scrollRef = useRef(null);
  const bottomBarRef = useRef(null);
  const tailRef = useRef(null);
  const [panelHeight, setPanelHeight] = useState(null);

  // ✅ Website validation
  const isValidWebsite = (url) => {
    const urlPattern =
      /^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?(\/.*)?$/;
    return urlPattern.test(url);
  };

  /* ---------------- Hand wave animation ---------------- */
  useEffect(() => {
    if (currentState !== "initial") return;
    let waveInterval;
    let cycleTimeout;

    const startShakeCycle = () => {
      setIsShaking(true);
      setWavePhase(0);

      waveInterval = setInterval(() => {
        setWavePhase((prev) => (prev + 1) % 8);
      }, 100);

      cycleTimeout = setTimeout(() => {
        clearInterval(waveInterval);
        setIsShaking(false);
        setWavePhase(0);
        setTimeout(startShakeCycle, 1000);
      }, 800);
    };

    startShakeCycle();
    return () => {
      clearInterval(waveInterval);
      clearTimeout(cycleTimeout);
    };
  }, [currentState]);

  const getWaveRotation = () => {
    if (!isShaking) return 0;
    switch (wavePhase % 4) {
      case 1: return -30;
      case 3: return 30;
      default: return 0;
    }
  };

  /* ---------------- Fixed height calculation ---------------- */
  const recomputePanelHeight = () => {
    if (!panelRef.current) return;
    const vpH = window.innerHeight;
    const barH = bottomBarRef.current?.getBoundingClientRect().height ?? 0;
    const topOffset = panelRef.current.getBoundingClientRect().top;
    const extraGutters = 24;
    const h = Math.max(320, vpH - barH - topOffset - extraGutters);
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
  }, [showInput, currentState, messages.length]);

  /* ---------------- Auto-scroll ---------------- */
  useEffect(() => {
    if (tailRef.current && scrollRef.current) {
      tailRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages, currentState]);

  /* ---------------- Handlers ---------------- */
  const handleSend = () => {
    if (!site.trim()) return;

    if (!isValidWebsite(site.trim())) {
      setError(
        "Please enter a valid website URL (e.g., company.com or http://company.com)"
      );
      return;
    }

    setError("");
    const displayUrl = site.trim().startsWith("http")
      ? site.trim()
      : `https://${site.trim()}`;

    setMessages([displayUrl]);
    setTimeout(() => setCurrentState("submitted"), 300);

    onWebsiteSubmit?.(site.trim());
    try {
      localStorage.setItem("websiteData", JSON.stringify({ site: site.trim() }));
    } catch {}
    setSite("");
  };

  const handleNext = () => onNext?.();

  const handleTryDifferent = () => {
    setCurrentState("initial");
    setMessages([]);
    setError("");
    setSite("");
    setShowInput(true);
  };

  const handleNo = () => {
    setCurrentState("confirmed");
    setShowInput(false);
  };

  return (
    <div className="w-full h-full flex flex-col bg-transparent">
      {/* Hide scrollbar globally */}
      <style jsx global>{`
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      {/* ---------------- White Section ---------------- */}
      <div className="px-6 md:px-8 pt-6 pb-3">
        <div
          ref={panelRef}
          className="mx-auto w-full max-w-[820px] rounded-2xl bg-transparent"
          style={{
            padding: "28px 24px",
            height: panelHeight ? `${panelHeight}px` : "auto",
          }}
        >
          <div
            ref={scrollRef}
            className="h-full w-full overflow-y-auto no-scrollbar"
          >
            <div className="flex flex-col gap-8 md:gap-10">
              {currentState === "initial" && (
                <div className="flex flex-col items-center gap-3 mt-2">
                  <div
                    className={`text-[84px] leading-none transition-transform ${
                      isShaking ? "duration-100 ease-linear" : "duration-300 ease-out"
                    }`}
                    style={{
                      transform: `rotate(${getWaveRotation()}deg) ${
                        isShaking && wavePhase % 2 === 1 ? "scale(1.06)" : "scale(1)"
                      }`,
                      transformOrigin: "bottom center",
                      color: "#9ca3af",
                    }}
                    aria-hidden
                  >
                    ✋
                  </div>
                  <h2 className="text-[18px] font-semibold text-gray-500 tracking-wide">
                    Hello!!!
                  </h2>
                </div>
              )}

              <div className="max-w-[640px]">
                <h3 className="text-[18px] font-bold text-gray-900 mb-3">
                  Welcome, Sam!
                </h3>
                <p className="text-[15px] text-gray-700 leading-relaxed">
                  Add your first project by entering your website and I&apos;ll build a live{" "}
                  <span className="font-bold text-gray-900">SEO dashboard</span> for you.
                </p>
                <p className="text-[13px] text-gray-400 mt-4">
                  For more information please! Go to{" "}
                  <span className="font-semibold text-gray-700">DASHBOARD</span> & click{" "}
                  <span className="font-semibold text-gray-700">INFO</span> tab
                </p>
              </div>

              {messages.map((msg, i) => (
                <div key={i} className="flex justify-end">
                  <div className="bg-[var(--input)] text-gray-800 rounded-2xl shadow-sm border border-gray-200 px-6 py-4 my-1 text-[16px] font-medium max-w-[420px]">
                    {msg}
                  </div>
                </div>
              ))}

              {currentState === "submitted" && (
                <div className="max-w-[640px]">
                  <h3 className="text-[18px] font-bold text-gray-900 mb-3">
                    Here’s your site report — take a quick look on the Info Tab.
                  </h3>
                  <p className="text-[15px] text-gray-600 mt-2">
                    If not, you can also try a different URL?
                  </p>
                  <div className="flex items-center gap-12 mt-6 text-[14px]">
                    <button
                      onClick={handleNo}
                      className="text-gray-700 hover:text-gray-900 font-medium"
                    >
                      NO
                    </button>
                    <button
                      onClick={handleTryDifferent}
                      className="text-[#d45427] hover:brightness-110 font-medium"
                    >
                      YES, Try different URL!
                    </button>
                  </div>
                </div>
              )}

              <div ref={tailRef} />
            </div>
          </div>
        </div>
      </div>

      {/* ---------------- Bottom Bar ---------------- */}
      <div ref={bottomBarRef} className="flex-shrink-0 bg-transparent">
        <div className="border-t border-gray-200" />
        <div className="mx-auto w-full max-w-[1120px] px-6 md:px-8">
          {showInput ? (
            <div className="py-7">
              <div className="mx-auto w-full max-w-[780px]">
                <div className="flex items-center rounded-full border border-gray-300 bg-white shadow-sm pl-5 pr-2 py-2.5">
                  <input
                    type="text"
                    placeholder="Add Site : eg: (http://company.com)"
                    value={site}
                    onChange={(e) => setSite(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    className="flex-1 bg-transparent outline-none text-[15px] text-gray-700 placeholder-gray-400"
                  />
                  <button
                    onClick={handleSend}
                    className="grid place-items-center h-9 w-9 rounded-full bg-[image:var(--infoHighlight-gradient)] text-white hover:opacity-90"
                    aria-label="Submit website"
                  >
                    <ArrowRight size={18} />
                  </button>
                </div>
                {error && (
                  <p className="text-[13px] text-red-500 text-center mt-2">{error}</p>
                )}
              </div>
            </div>
          ) : (
            <div className="py-7 flex flex-col items-center gap-4">
              <p className="text-[14px] text-gray-600">
                All set? Click <span className="font-semibold text-gray-900">‘Next’</span> to continue.
              </p>
              <button
                onClick={handleNext}
                className="inline-flex items-center gap-2 rounded-full bg-[image:var(--infoHighlight-gradient)] px-6 py-3 text-white hover:bg-gray-800 shadow-sm"
              >
                Next <ArrowRight size={18} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
