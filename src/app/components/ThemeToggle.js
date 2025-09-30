
"use client";

import { useTheme } from "./ThemeContext";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  // Sizing tuned for a compact control
  const trackW = 84;
  const trackH = 40;
  const thumb = 32;
  const pad = 4;
  const translateX = trackW - (thumb + pad * 2);
  const topOffset = (trackH - thumb) / 2;

  // Gradient with black veil. Uses CSS var if present, falls back to the requested colors.
  const gradient =
    "linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), " +
    "var(--app-gradient-strong, linear-gradient(to right, #d45427 0%, #ffa615 100%))";

  return (
    <button
      aria-label="Toggle dark/light mode"
      aria-pressed={isDark}
      onClick={toggleTheme}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggleTheme();
        }
      }}
      className="fixed top-5 right-6 z-50"
      style={{ width: trackW, height: trackH }}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <div
        className="relative w-full h-full rounded-full bg-no-repeat bg-cover border shadow-sm"
        style={{
          backgroundImage: gradient,
          borderColor: "rgba(0,0,0,0.35)",
        }}
      >
        {/* Static icons (follow mode only): white in light, grey in dark */}
        <Moon
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2"
          color={isDark ? "#A5A8B3" : "#FFFFFF"}
          strokeWidth={2}
        />
        <Sun
          size={18}
          className="absolute right-3 top-1/2 -translate-y-1/2"
          color={isDark ? "#A5A8B3" : "#FFFFFF"}
          strokeWidth={2}
        />

        {/* Sliding thumb: black background with the active icon in white */}
        <div
          className="absolute rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.35)] ring-1 ring-white/20 flex items-center justify-center transition-transform duration-300 ease-out"
          style={{
            width: thumb,
            height: thumb,
            top: topOffset,
            left: pad,
            transform: `translateX(\${isDark ? translateX : 0}px)`,
            background: "#000000",
          }}
        >
          {isDark ? (
            <Moon size={16} color="#FFFFFF" strokeWidth={2} />
          ) : (
            <Sun size={16} color="#FFFFFF" strokeWidth={2} />
          )}
        </div>
      </div>
    </button>
  );
}
