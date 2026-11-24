"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sun,
  Moon,
  Volume2,
  VolumeX,
  SunMedium,
  Sliders,
  ArrowLeft,
} from "lucide-react";
import { Logo } from "./ui/Logo";

// Web Audio API synthetic switch click sound (zero network dependency)
function playMechanicalClick(isMuted: boolean, type: "on" | "off" = "on") {
  if (isMuted || typeof window === "undefined") return;
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(type === "on" ? 2200 : 1800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.025);

    filter.type = "bandpass";
    filter.frequency.setValueAtTime(type === "on" ? 2400 : 1600, ctx.currentTime);
    filter.Q.setValueAtTime(2.5, ctx.currentTime);

    gain.gain.setValueAtTime(0.35, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.025);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.025);

    // Low mechanical contact thump
    const subOsc = ctx.createOscillator();
    const subGain = ctx.createGain();
    subOsc.type = "sine";
    subOsc.frequency.setValueAtTime(type === "on" ? 220 : 180, ctx.currentTime);
    subOsc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.035);

    subGain.gain.setValueAtTime(0.4, ctx.currentTime);
    subGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.035);

    subOsc.connect(subGain);
    subGain.connect(ctx.destination);

    subOsc.start();
    subOsc.stop(ctx.currentTime + 0.035);
  } catch {
    // Ignore audio context exceptions before user interaction
  }
}

export function ArchitecturalHero() {
  // Starts in daytime (lights OFF), then smoothly animates to night (lights ON) in full view
  const [isNight, setIsNight] = useState(false);

  // Room Simulator State
  const [isSimulatorActive, setIsSimulatorActive] = useState(false);
  const [roomDayMode, setRoomDayMode] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Electrical Hardware Controls inside the Room
  const [downlightsOn, setDownlightsOn] = useState(true);
  const [coveOn, setCoveOn] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    // 1. Always reset to Day mode on mount or refresh
    setIsNight(false);

    let transitionTimer: NodeJS.Timeout;

    const triggerDayToNightAnimation = () => {
      transitionTimer = setTimeout(() => {
        setIsNight(true);
      }, 1000);
    };

    const handleSplashDone = () => {
      triggerDayToNightAnimation();
    };

    window.addEventListener("splash_screen_completed", handleSplashDone);

    const fallbackTimer = setTimeout(() => {
      setIsNight(true);
    }, 2400);

    // Listen for custom event from Navbar to open simulator directly from hero
    const handleOpenSimulator = () => {
      setIsNight(true); // ensure villa lights are on
      setIsSimulatorActive(true);
    };

    window.addEventListener("open_room_simulator", handleOpenSimulator);

    // Check query params if navigated via /?simulator=true
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("simulator") === "true") {
        setIsNight(true);
        setIsSimulatorActive(true);
      }
    }

    return () => {
      window.removeEventListener("splash_screen_completed", handleSplashDone);
      window.removeEventListener("open_room_simulator", handleOpenSimulator);
      clearTimeout(transitionTimer);
      clearTimeout(fallbackTimer);
    };
  }, []);

  const toggleDownlights = () => {
    const nextVal = !downlightsOn;
    playMechanicalClick(isMuted, nextVal ? "on" : "off");
    setDownlightsOn(nextVal);
  };

  const toggleCove = () => {
    const nextVal = !coveOn;
    playMechanicalClick(isMuted, nextVal ? "on" : "off");
    setCoveOn(nextVal);
  };

  const exitSimulator = () => {
    playMechanicalClick(isMuted, "off");
    setIsSimulatorActive(false);
    if (typeof window !== "undefined" && window.history.replaceState) {
      const url = new URL(window.location.href);
      url.searchParams.delete("simulator");
      window.history.replaceState({}, "", url.pathname);
    }
  };

  // Lighting state calculations for smooth, artifact-free illumination:
  const isLightsOff = !downlightsOn && !coveOn;
  const isCoveOnly = !downlightsOn && coveOn;
  const isDownlightsOnly = downlightsOn && !coveOn;

  return (
    <section className="relative w-full h-[100svh] min-h-[560px] max-h-[1080px] overflow-hidden bg-zinc-950 select-none">
      {/* ================================================================= */}
      {/* 1. EXTERIOR VILLA CAMERA CONTAINER (SMOOTH ZOOM-IN GLIDE)        */}
      {/* ================================================================= */}
      <motion.div
        className="absolute inset-0 z-0 origin-center"
        animate={{
          scale: isSimulatorActive ? (isMobile ? 2.8 : 3.5) : 1,
          x: isSimulatorActive ? (isMobile ? "0%" : "-6%") : "0%",
          y: isSimulatorActive ? (isMobile ? "-10%" : "-16%") : "0%", // Focus on 1st-floor glowing glass facade
        }}
        transition={{
          duration: isSimulatorActive ? 2.4 : 1.6,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        {/* DAYTIME VILLA LAYER */}
        <div className="absolute inset-0">
          {/* Desktop/Laptop (Landscape) */}
          <img
            src="/images/villa-day.jpg"
            alt="Jay Ganesh Architectural Villa - Daylight View"
            className="hidden sm:block w-full h-full object-cover object-center"
            loading="eager"
          />
          {/* Mobile Phone (Portrait) */}
          <img
            src="/images/villa-day-mobile.jpg"
            alt="Jay Ganesh Architectural Villa - Daylight View"
            className="block sm:hidden w-full h-full object-cover object-center"
            loading="eager"
          />
        </div>

        {/* NIGHTTIME ILLUMINATED VILLA LAYER */}
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: isNight ? 1 : 0 }}
          transition={{ duration: 4.8, ease: [0.33, 1, 0.68, 1] }}
        >
          {/* Desktop/Laptop (Landscape) */}
          <img
            src="/images/villa-night.jpg"
            alt="Jay Ganesh Architectural Villa - Night Illumination"
            className="hidden sm:block w-full h-full object-cover object-center"
            loading="eager"
          />
          {/* Mobile Phone (Portrait) */}
          <img
            src="/images/villa-night-mobile.jpg"
            alt="Jay Ganesh Architectural Villa - Night Illumination"
            className="block sm:hidden w-full h-full object-cover object-center"
            loading="eager"
          />

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isNight ? 0.45 : 0 }}
            transition={{ duration: 4.8, ease: "easeInOut" }}
            className="absolute inset-0 bg-gradient-to-t from-amber-500/15 via-transparent to-transparent pointer-events-none"
          />
        </motion.div>
      </motion.div>

      {/* Soft Bottom Vignette for Smooth Transition into Content Below */}
      <div className="absolute inset-0 z-20 bg-gradient-to-b from-black/45 via-transparent to-zinc-950 pointer-events-none" />

      {/* ================================================================= */}
      {/* 2. CINEMATIC SHOP NAME IN SKY (Fades Out on Simulator Zoom)      */}
      {/* ================================================================= */}
      <div className="relative z-30 w-full pt-20 sm:pt-24 md:pt-28 flex flex-col items-center text-center px-4 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{
            opacity: isSimulatorActive ? 0 : 1,
            y: isSimulatorActive ? -30 : 0,
          }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
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

      {/* Subtle Scroll Indicator at Bottom (Hidden when simulator is active) */}
      {!isSimulatorActive && (
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
      )}

      {/* ================================================================= */}
      {/* 3. LUXURY FIRST-FLOOR LIVING ROOM INTERIOR VIEW                  */}
      {/* 100% Real architectural photographs for every single light state */}
      {/* ZERO external yellow stickers, ZERO pop line light CSS gradients */}
      {/* ================================================================= */}
      <AnimatePresence>
        {isSimulatorActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 1.1, duration: 1.0, ease: "easeInOut" }}
            className="absolute inset-0 z-40 overflow-hidden bg-black"
          >
            {/* Real Photographic Layers - Smooth Full-Frame Day/Night Crossfade & Optical Lighting */}
            {/* 1. Night Living Room Layer */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              animate={{
                opacity: roomDayMode ? 0 : 1,
                filter: isLightsOff
                  ? "brightness(0.24) contrast(1.12) saturate(0.6)"
                  : isCoveOnly
                  ? "brightness(0.68) contrast(1.05)"
                  : isDownlightsOnly
                  ? "brightness(0.78) contrast(1.05)"
                  : "brightness(1) contrast(1) saturate(1)",
              }}
              transition={{
                opacity: { duration: 0.8, ease: "easeInOut" },
                filter: { duration: 0.45, ease: "easeInOut" },
              }}
            >
              {/* Desktop / Laptop User (Landscape) */}
              <div className="hidden sm:block absolute inset-0">
                <Image
                  src="/images/room/villa-interior-night.jpg"
                  alt="Villa Living Room Night"
                  fill
                  priority
                  sizes="100vw"
                  className="object-cover object-center"
                />
              </div>
              {/* Mobile Phone User (Portrait) */}
              <div className="block sm:hidden absolute inset-0">
                <Image
                  src="/images/room/villa-interior-mobile.jpg"
                  alt="Villa Living Room Night Mobile"
                  fill
                  priority
                  sizes="100vw"
                  className="object-cover object-center"
                />
              </div>
            </motion.div>

            {/* 2. Daytime Living Room Layer with Active Lighting Animations */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              animate={{
                opacity: roomDayMode ? 1 : 0,
                filter: isLightsOff
                  ? "brightness(0.78) contrast(1.08) saturate(0.82)"
                  : isCoveOnly
                  ? "brightness(0.92) contrast(1.02) saturate(0.95)"
                  : isDownlightsOnly
                  ? "brightness(0.96) contrast(1.02) saturate(0.98)"
                  : "brightness(1.08) contrast(1.02) saturate(1.06)",
              }}
              transition={{
                opacity: { duration: 0.8, ease: "easeInOut" },
                filter: { duration: 0.45, ease: "easeInOut" },
              }}
            >
              {/* Desktop / Laptop User (Landscape) */}
              <div className="hidden sm:block absolute inset-0">
                <Image
                  src="/images/room/villa-interior-day.jpg"
                  alt="Villa Living Room Daylight"
                  fill
                  priority
                  sizes="100vw"
                  className="object-cover object-center"
                />
              </div>
              {/* Mobile Phone User (Portrait) */}
              <div className="block sm:hidden absolute inset-0">
                <Image
                  src="/images/room/villa-interior-mobile-day.jpg"
                  alt="Villa Living Room Daylight Mobile"
                  fill
                  priority
                  sizes="100vw"
                  className="object-cover object-center"
                />
              </div>
            </motion.div>

            {/* ================================================================= */}
            {/* 4. NAVBAR OF SIMULATOR IN FOOTER (FLOATING BOTTOM PILL)           */}
            {/* Matches our exact navbar design, positioned as a footer dock      */}
            {/* ================================================================= */}
            <motion.div
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.3, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="fixed bottom-4 sm:bottom-6 left-0 right-0 z-50 mx-4 md:mx-auto max-w-4xl"
            >
              <header className="relative bg-white/90 dark:bg-zinc-950/85 backdrop-blur-xl rounded-full border border-slate-200/90 dark:border-zinc-800/80 shadow-2xl shadow-black/40 dark:shadow-black/70 hover:border-amber-500/30 transition-all duration-300">
                {/* Thin amber light along top edge */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-amber-500/40 to-transparent"
                />

                <div className="px-3 sm:px-6">
                  <div className="flex justify-between items-center h-14 sm:h-16">
                    {/* Left: Brand Logo & Room Simulator Subtitle */}
                    <div className="flex-shrink-0 flex items-center">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <Logo size={32} className="transition-transform sm:w-9 sm:h-9" />
                        <div className="hidden sm:flex flex-col">
                          <span className="font-heading font-bold text-xs sm:text-base leading-tight text-slate-900 dark:text-white">
                            Jay Ganesh
                          </span>
                          <span className="text-[9px] sm:text-[10px] tracking-wider uppercase text-brand-gold font-semibold -mt-0.5">
                            Room Simulator
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Center: Controls matching our navbar design */}
                    <nav className="flex items-center space-x-1 sm:space-x-2">
                      {/* Downlights Toggle */}
                      <button
                        onClick={toggleDownlights}
                        className={`relative isolate flex items-center rounded-full px-2.5 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium outline-none transition-all duration-200 ${
                          downlightsOn
                            ? "bg-amber-500/15 border border-amber-500/30 text-amber-500 dark:text-amber-400 font-semibold shadow-sm"
                            : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200"
                        }`}
                        title="Toggle Real 3000K Architectural Downlights"
                      >
                        <SunMedium size={14} className="sm:mr-1.5 shrink-0" />
                        <span className="hidden xs:inline sm:inline">Downlights</span>
                        {downlightsOn && (
                          <span className="ml-1 sm:ml-1.5 h-1.5 w-1.5 rounded-full bg-amber-500 dark:bg-amber-400" />
                        )}
                      </button>

                      {/* Cove Lighting Toggle */}
                      <button
                        onClick={toggleCove}
                        className={`relative isolate flex items-center rounded-full px-2.5 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium outline-none transition-all duration-200 ${
                          coveOn
                            ? "bg-amber-500/15 border border-amber-500/30 text-amber-500 dark:text-amber-400 font-semibold shadow-sm"
                            : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200"
                        }`}
                        title="Toggle Real Drop-Ceiling Linear Cove Profile"
                      >
                        <Sliders size={14} className="sm:mr-1.5 shrink-0" />
                        <span className="hidden xs:inline sm:inline">Cove</span>
                        {coveOn && (
                          <span className="ml-1 sm:ml-1.5 h-1.5 w-1.5 rounded-full bg-amber-500 dark:bg-amber-400" />
                        )}
                      </button>

                      {/* Day / Night View Toggle */}
                      <button
                        onClick={() => {
                          playMechanicalClick(isMuted, !roomDayMode ? "on" : "off");
                          setRoomDayMode(!roomDayMode);
                        }}
                        className="relative isolate flex items-center rounded-full px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs font-medium text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200 outline-none transition-all duration-200"
                        title={roomDayMode ? "Switch to Night 3000K Lighting" : "Switch to Daytime View"}
                      >
                        {roomDayMode ? (
                          <Sun size={15} className="text-amber-500" />
                        ) : (
                          <Moon size={15} className="text-indigo-400" />
                        )}
                      </button>
                    </nav>

                    {/* Right: Sound FX & Exit Back to Exterior Villa */}
                    <div className="flex items-center space-x-1.5 sm:space-x-3">
                      {/* Audio Toggle */}
                      <button
                        onClick={() => setIsMuted(!isMuted)}
                        className="p-1.5 sm:p-2 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800/80 text-zinc-400 hover:text-white transition-colors"
                        title={isMuted ? "Unmute Acoustic Switch Clicks" : "Mute Sound"}
                      >
                        {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} className="text-amber-400" />}
                      </button>

                      {/* Back to Exterior Villa Glide */}
                      <button
                        onClick={exitSimulator}
                        className="inline-flex items-center gap-1 sm:gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-full text-xs font-semibold bg-amber-500/10 text-brand-gold border border-amber-500/30 hover:bg-amber-500/20 active:scale-95 transition-all"
                        title="Zoom back out to exterior villa"
                      >
                        <ArrowLeft size={13} />
                        <span className="hidden sm:inline">Exterior Villa</span>
                      </button>
                    </div>
                  </div>
                </div>
              </header>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

export default ArchitecturalHero;
