"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

export function ArchitecturalHero() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isNight, setIsNight] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = resolvedTheme || theme || "dark";
  const isDark = currentTheme === "dark";

  // Direct sync with website Theme Toggle (when user toggles light/dark mode)
  useEffect(() => {
    if (!mounted) return;
    setIsNight(isDark);
  }, [isDark, mounted]);

  // Initial cinematic Day-to-Night transition (matching the reference video)
  useEffect(() => {
    if (!isDark) {
      setIsNight(false);
      return;
    }

    // Always start at daylight view first
    setIsNight(false);
    let transitionTimer: NodeJS.Timeout;

    const startTransition = () => {
      // Hold for 700ms so visitor clearly sees the daylight villa before lights turn on
      transitionTimer = setTimeout(() => {
        setIsNight(true);
      }, 700);
    };

    const handleSplashDone = () => {
      startTransition();
    };

    window.addEventListener("splash_screen_completed", handleSplashDone);

    // Fallback if splash screen is completed or bypassed
    const fallbackTimer = setTimeout(() => {
      setIsNight(true);
    }, 1600);

    return () => {
      window.removeEventListener("splash_screen_completed", handleSplashDone);
      clearTimeout(transitionTimer);
      clearTimeout(fallbackTimer);
    };
  }, []);

  // Quick interactive toggle to manually switch between daylight and nighttime lighting
  const toggleLighting = () => {
    const nextState = !isNight;
    setIsNight(nextState);
    if (setTheme) {
      setTheme(nextState ? "dark" : "light");
    }
  };

  return (
    <section className="relative w-full h-[62svh] min-h-[460px] max-h-[580px] sm:h-[100svh] sm:min-h-[580px] sm:max-h-[1080px] overflow-hidden bg-zinc-950 select-none">
      {/* ================================================================= */}
      {/* 1. DAYTIME VILLA LAYER (ALL LIGHTS OFF - FULL FACADE VISIBLE)    */}
      {/* ================================================================= */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/villa-day.jpg"
          alt="Jay Ganesh Architectural Villa - Daylight View"
          className="w-full h-full object-cover object-[50%_40%] sm:object-center"
          loading="eager"
        />
      </div>

      {/* ================================================================= */}
      {/* 2. NIGHTTIME ILLUMINATED VILLA LAYER (WARM LIGHTS ON)             */}
      {/* ================================================================= */}
      <motion.div
        className="absolute inset-0 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: isNight ? 1 : 0 }}
        transition={{ duration: 4.2, ease: [0.33, 1, 0.68, 1] }}
      >
        <img
          src="/images/villa-night.jpg"
          alt="Jay Ganesh Architectural Villa - Night Illumination"
          className="w-full h-full object-cover object-[50%_40%] sm:object-center"
          loading="eager"
        />

        {/* Ambient Warm Architectural Light Glow Layer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isNight ? 0.45 : 0 }}
          transition={{ duration: 4.2, ease: "easeInOut" }}
          className="absolute inset-0 bg-gradient-to-t from-amber-500/15 via-transparent to-transparent pointer-events-none"
        />
      </motion.div>

      {/* Soft Bottom Vignette for Smooth Transition into Content Below */}
      <div className="absolute inset-0 z-20 bg-gradient-to-b from-black/45 via-transparent to-zinc-950 pointer-events-none" />

      {/* ================================================================= */}
      {/* 3. CINEMATIC SHOP NAME IN SKY (MOBILE OPTIMIZED TYPOGRAPHY)       */}
      {/* ================================================================= */}
      <div className="relative z-30 w-full pt-16 sm:pt-24 md:pt-28 flex flex-col items-center text-center px-4 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center max-w-full"
        >
          <h1 className="text-3xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-[0.14em] sm:tracking-[0.2em] uppercase leading-tight text-white/95 drop-shadow-[0_12px_35px_rgba(0,0,0,0.9)] font-heading">
            Jay Ganesh
          </h1>
          <p className="mt-1.5 sm:mt-2 text-[10px] sm:text-xs md:text-sm font-semibold tracking-[0.22em] sm:tracking-[0.38em] text-zinc-300 uppercase drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]">
            Architectural Electrification
          </p>
        </motion.div>
      </div>

      {/* ================================================================= */}
      {/* 4. INTERACTIVE LIGHTING CONTROLLER PILL                           */}
      {/* ================================================================= */}
      <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2">
        <button
          type="button"
          onClick={toggleLighting}
          className="group inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full bg-black/65 hover:bg-black/85 backdrop-blur-md border border-white/20 hover:border-amber-400/50 text-white text-xs font-semibold shadow-lg shadow-black/50 transition-all duration-300 cursor-pointer select-none active:scale-95"
          aria-label={isNight ? "Switch villa to daylight mode" : "Switch villa to architectural illumination"}
        >
          {isNight ? (
            <>
              <Moon size={13} className="text-amber-400 animate-pulse" />
              <span className="text-[11px] sm:text-xs font-medium">Night Lighting ON</span>
              <span className="text-[10px] text-zinc-400 border-l border-white/20 pl-1.5">Tap for Day</span>
            </>
          ) : (
            <>
              <Sun size={13} className="text-amber-300" />
              <span className="text-[11px] sm:text-xs font-medium">Daylight View</span>
              <span className="text-[10px] text-zinc-400 border-l border-white/20 pl-1.5">Tap for Lights</span>
            </>
          )}
        </button>
      </div>
    </section>
  );
}

export default ArchitecturalHero;
