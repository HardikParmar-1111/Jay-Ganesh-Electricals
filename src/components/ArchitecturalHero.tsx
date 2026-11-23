"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

export function ArchitecturalHero() {
  // Starts in daytime (lights OFF), then smoothly animates to night (lights ON) in full view
  const [isNight, setIsNight] = useState(false);

  useEffect(() => {
    // 1. Always reset to Day mode on mount or refresh
    setIsNight(false);

    let transitionTimer: NodeJS.Timeout;

    const triggerDayToNightAnimation = () => {
      // Pause for 1000ms so the visitor clearly registers the clean daylight view like in the reference video
      transitionTimer = setTimeout(() => {
        setIsNight(true);
      }, 1000);
    };

    // 2. Start animation when the starting splash screen has finished revealing the page
    const handleSplashDone = () => {
      triggerDayToNightAnimation();
    };

    window.addEventListener("splash_screen_completed", handleSplashDone);

    // Fallback: If no splash screen (e.g. fast load or client navigation), start after 2.4s
    const fallbackTimer = setTimeout(() => {
      setIsNight(true);
    }, 2400);

    return () => {
      window.removeEventListener("splash_screen_completed", handleSplashDone);
      clearTimeout(transitionTimer);
      clearTimeout(fallbackTimer);
    };
  }, []);

  return (
    <section className="relative w-full h-screen overflow-hidden bg-zinc-950 select-none">
      {/* ================================================================= */}
      {/* 1. DAYTIME VILLA LAYER (EXACT SAME HOUSE - ALL LIGHTS OFF) */}
      {/* ================================================================= */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/villa-day.jpg"
          alt="Jay Ganesh Architectural Villa - Daylight View"
          className="w-full h-full object-cover object-center"
          loading="eager"
        />
      </div>

      {/* ================================================================= */}
      {/* 2. NIGHTTIME ILLUMINATED VILLA LAYER (EXACT SAME HOUSE - LIGHTS ON) */}
      {/* ================================================================= */}
      <motion.div
        className="absolute inset-0 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: isNight ? 1 : 0 }}
        transition={{ duration: 4.8, ease: [0.33, 1, 0.68, 1] }}
      >
        <img
          src="/images/villa-night.jpg"
          alt="Jay Ganesh Architectural Villa - Night Illumination"
          className="w-full h-full object-cover object-center"
          loading="eager"
        />

        {/* Ambient Warm Architectural Light Glow Layer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isNight ? 0.45 : 0 }}
          transition={{ duration: 4.8, ease: "easeInOut" }}
          className="absolute inset-0 bg-gradient-to-t from-amber-500/15 via-transparent to-transparent pointer-events-none"
        />
      </motion.div>

      {/* Soft Bottom Vignette for Smooth Transition into Catalog/Content Below */}
      <div className="absolute inset-0 z-20 bg-gradient-to-b from-black/40 via-transparent to-zinc-950 pointer-events-none" />

      {/* ================================================================= */}
      {/* 3. CINEMATIC SHOP NAME IN SKY (VOLTRA AESTHETIC - ABOVE ROOFLINE) */}
      {/* ================================================================= */}
      <div className="relative z-30 w-full pt-16 sm:pt-20 md:pt-24 flex flex-col items-center text-center px-4 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center"
        >
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-[0.2em] uppercase leading-tight text-white/95 drop-shadow-[0_12px_35px_rgba(0,0,0,0.9)] font-heading">
            Jay Ganesh
          </h1>
          <p className="mt-2 text-xs sm:text-sm md:text-base font-semibold tracking-[0.38em] text-zinc-300 uppercase drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]">
            Architectural Electrification
          </p>
        </motion.div>
      </div>

      {/* Subtle Scroll Indicator at Bottom */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-1.5"
        >
          <span className="text-[10px] tracking-[0.25em] uppercase text-zinc-400 font-medium">
            Scroll to explore
          </span>
          <div className="w-1 h-5 rounded-full bg-gradient-to-b from-white/60 to-transparent" />
        </motion.div>
      </div>
    </section>
  );
}

export default ArchitecturalHero;
