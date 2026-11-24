"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sun,
  Moon,
  Volume2,
  VolumeX,
  Zap,
  Sliders,
  Wind,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  ArrowLeft,
  ChevronRight,
  Eye,
  Play,
  SkipForward,
} from "lucide-react";

// Web Audio API synthetic switch click sound (zero network dependency)
function playMechanicalClick(isMuted: boolean, type: "on" | "off" = "on") {
  if (isMuted || typeof window === "undefined") return;
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    // High-frequency transient snap
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

    // Subtle low-frequency mechanical thud
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
    // Ignore audio context exceptions before user gesture
  }
}

export function VirtualRoomSimulator() {
  // Cinematic Camera Glide-In State (Exterior Villa -> First Floor Living Room)
  const [isGliding, setIsGliding] = useState(true);
  const [glideProgress, setGlideProgress] = useState(0);

  // Environmental & Lighting States
  const [isDay, setIsDay] = useState(false); // default to evening for architectural lighting impact
  const [isMuted, setIsMuted] = useState(false);
  const [activePreset, setActivePreset] = useState<string>("evening");

  // Electrical Hardware Switches
  const [downlightsOn, setDownlightsOn] = useState(true);
  const [coveOn, setCoveOn] = useState(true);
  const [coveDimmer, setCoveDimmer] = useState(85); // 10% to 100%
  const [fanOn, setFanOn] = useState(true);
  const [fanSpeed, setFanSpeed] = useState<1 | 2 | 3 | 4 | 5>(3);
  const [wallWashOn, setWallWashOn] = useState(true);
  const [poolLandscapeOn, setPoolLandscapeOn] = useState(true);

  // Transient inrush flash effect for realistic LED driver ignition
  const [flashDownlights, setFlashDownlights] = useState(false);

  // Switchboard docked expansion mode for mobile & compact screens
  const [isSwitchboardExpanded, setIsSwitchboardExpanded] = useState(true);

  // Automated Smooth Glide-In Tour Timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isGliding) {
      timer = setTimeout(() => {
        setIsGliding(false);
        // Brief illumination wake flash upon entry
        setFlashDownlights(true);
        setTimeout(() => setFlashDownlights(false), 80);
      }, 2600);
    }
    return () => clearTimeout(timer);
  }, [isGliding]);

  // Re-trigger the exterior zoom-in glide tour
  const triggerGlideTour = () => {
    playMechanicalClick(isMuted, "on");
    setIsGliding(true);
  };

  // Toggle switch helper
  const handleToggle = (
    setter: React.Dispatch<React.SetStateAction<boolean>>,
    currentVal: boolean,
    hasFlash = false
  ) => {
    const nextVal = !currentVal;
    playMechanicalClick(isMuted, nextVal ? "on" : "off");
    setter(nextVal);
    if (hasFlash && nextVal) {
      setFlashDownlights(true);
      setTimeout(() => setFlashDownlights(false), 70);
    }
    setActivePreset("custom");
  };

  // Preset Handlers
  const applyPreset = (presetKey: string) => {
    playMechanicalClick(isMuted, "on");
    setActivePreset(presetKey);
    switch (presetKey) {
      case "evening":
        setIsDay(false);
        setDownlightsOn(true);
        setCoveOn(true);
        setCoveDimmer(85);
        setFanOn(true);
        setFanSpeed(3);
        setWallWashOn(true);
        setPoolLandscapeOn(true);
        break;
      case "cinema":
        setIsDay(false);
        setDownlightsOn(false);
        setCoveOn(true);
        setCoveDimmer(20);
        setFanOn(true);
        setFanSpeed(2);
        setWallWashOn(false);
        setPoolLandscapeOn(false);
        break;
      case "daylight":
        setIsDay(true);
        setDownlightsOn(false);
        setCoveOn(false);
        setFanOn(true);
        setFanSpeed(4);
        setWallWashOn(false);
        setPoolLandscapeOn(false);
        break;
      case "all_on":
        setIsDay(false);
        setDownlightsOn(true);
        setCoveOn(true);
        setCoveDimmer(100);
        setFanOn(true);
        setFanSpeed(5);
        setWallWashOn(true);
        setPoolLandscapeOn(true);
        break;
      case "all_off":
        setDownlightsOn(false);
        setCoveOn(false);
        setFanOn(false);
        setWallWashOn(false);
        setPoolLandscapeOn(false);
        break;
    }
  };

  // Live Wattage Calculation based on real contractor ratings
  const activeLoadWatts = useMemo(() => {
    let watts = 0;
    if (downlightsOn) watts += 48; // 4x 12W COB recessed spots
    if (coveOn) watts += Math.round(36 * (coveDimmer / 100)); // 36W linear profile with driver
    if (fanOn) {
      const fanWatts = [0, 5, 9, 15, 22, 28][fanSpeed]; // High-efficiency BLDC motor
      watts += fanWatts;
    }
    if (wallWashOn) watts += 16; // 2x 8W architectural directional spots
    if (poolLandscapeOn) watts += 30; // IP65 exterior perimeter floodlights
    return watts;
  }, [downlightsOn, coveOn, coveDimmer, fanOn, fanSpeed, wallWashOn, poolLandscapeOn]);

  // Real BLDC Fan rotation duration in seconds based on speed
  const fanRotationDuration = useMemo(() => {
    if (!fanOn) return 0;
    const speedMap = {
      1: 1.8,
      2: 1.25,
      3: 0.85,
      4: 0.58,
      5: 0.38,
    };
    return speedMap[fanSpeed];
  }, [fanOn, fanSpeed]);

  return (
    <div className="relative min-h-screen bg-zinc-950 text-white selection:bg-amber-500 selection:text-black overflow-x-hidden pt-4 pb-16">
      {/* Top Bar Navigation & Simulator Controls */}
      <div className="sticky top-0 z-40 bg-zinc-950/85 backdrop-blur-md border-b border-zinc-800/80 px-4 sm:px-6 py-3.5 mb-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-zinc-400 hover:text-white transition-colors bg-zinc-900/90 border border-zinc-800 px-3 py-1.5 rounded-full hover:border-amber-500/40"
            >
              <ArrowLeft size={14} />
              <span>Back to Villa</span>
            </Link>
            <div className="h-4 w-px bg-zinc-800 hidden sm:block" />
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <h1 className="text-sm sm:text-base font-bold text-white tracking-wide">
                  Villa First-Floor Living Suite
                </h1>
                <span className="hidden md:inline-flex text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400">
                  Virtual Experience
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 hidden sm:block">
                Architectural 3000K Lighting &amp; Real BLDC Ceiling Fan Simulator
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Replay Cinematic Glide Tour */}
            <button
              onClick={triggerGlideTour}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-zinc-900 border border-zinc-800 hover:border-amber-500/50 text-zinc-300 hover:text-white transition-all active:scale-95"
              title="Replay cinematic zoom from exterior villa into room"
            >
              <Eye size={14} className="text-amber-400" />
              <span className="hidden sm:inline">Replay Exterior Tour</span>
            </button>

            {/* Day / Night Environment Toggle */}
            <button
              onClick={() => {
                playMechanicalClick(isMuted, isDay ? "off" : "on");
                setIsDay(!isDay);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-zinc-900 border border-zinc-800 hover:border-amber-500/50 text-zinc-200 transition-all hover:bg-zinc-800/80 active:scale-95"
              title={isDay ? "Switch to Night Mode" : "Switch to Day Mode"}
            >
              {isDay ? (
                <>
                  <Sun size={14} className="text-amber-400" />
                  <span className="hidden sm:inline">Daylight</span>
                </>
              ) : (
                <>
                  <Moon size={14} className="text-indigo-400" />
                  <span className="hidden sm:inline">Night 3000K</span>
                </>
              )}
            </button>

            {/* Sound Effects Toggle */}
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 rounded-full bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white transition-colors"
              title={isMuted ? "Unmute Switch Sound Effects" : "Mute Sound Effects"}
            >
              {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} className="text-amber-400" />}
            </button>
          </div>
        </div>
      </div>

      {/* Main Room Simulation Viewport */}
      <div className="relative w-full max-w-7xl mx-auto px-2 sm:px-6">
        {/* Photorealistic Canvas Frame */}
        <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full rounded-2xl sm:rounded-3xl overflow-hidden border border-zinc-800/80 shadow-2xl shadow-black/90 bg-black select-none">
          {/* ======================================================== */}
          {/* CINEMATIC EXTERIOR ZOOM-IN GLIDE ANIMATION                */}
          {/* Glides from exterior villa directly into first-floor room */}
          {/* ======================================================== */}
          <AnimatePresence>
            {isGliding && (
              <motion.div
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
                className="absolute inset-0 z-50 overflow-hidden bg-black"
              >
                {/* Exterior Villa Image zooming in towards first-floor living room */}
                <motion.div
                  initial={{ scale: 1, x: "0%", y: "0%" }}
                  animate={{
                    scale: 3.4,
                    x: "-6%",
                    y: "-16%", // Centers on the luminous first-floor glass facade
                  }}
                  transition={{
                    duration: 2.5,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="relative w-full h-full origin-center"
                >
                  <Image
                    src={isDay ? "/images/villa-day.jpg" : "/images/villa-night.jpg"}
                    alt="Exterior Villa View"
                    fill
                    priority
                    sizes="(max-width: 1280px) 100vw, 1280px"
                    className="object-cover object-center"
                  />
                  {/* Subtle target viewfinder reticle */}
                  <div className="absolute top-[48%] left-[46%] w-24 h-16 border border-amber-400/40 rounded-lg pointer-events-none shadow-[0_0_20px_rgba(251,191,36,0.3)] flex items-center justify-center">
                    <span className="text-[9px] font-mono tracking-widest text-amber-300 uppercase px-1.5 py-0.5 bg-black/60 rounded">
                      1st Floor Suite
                    </span>
                  </div>
                </motion.div>

                {/* Cinematic Vignette & Motion Blur Overlay */}
                <div className="absolute inset-0 bg-radial-vignette pointer-events-none" />

                {/* Glide HUD Status Pill */}
                <div className="absolute top-6 left-6 z-50 flex items-center gap-3 bg-zinc-950/85 backdrop-blur-md border border-amber-500/30 px-4 py-2 rounded-full shadow-2xl">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
                  <span className="text-xs font-mono font-semibold text-zinc-200">
                    Entering Villa Ground-Floor Living Suite...
                  </span>
                  <button
                    onClick={() => setIsGliding(false)}
                    className="ml-2 text-[11px] font-bold text-amber-400 hover:text-white uppercase flex items-center gap-1 transition-colors"
                  >
                    <span>Skip</span>
                    <SkipForward size={12} />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ======================================================== */}
          {/* BASE ROOM INTERIOR LAYERS (Day & Night)                  */}
          {/* ======================================================== */}

          {/* Base Layer: Daytime Room View */}
          <div
            className="absolute inset-0 transition-opacity duration-1000 ease-in-out pointer-events-none"
            style={{ opacity: isDay ? 1 : 0 }}
          >
            <Image
              src="/images/room/villa-interior-day.jpg"
              alt="Luxury Villa Living Room Daytime"
              fill
              priority
              sizes="(max-width: 1280px) 100vw, 1280px"
              className="object-cover object-center"
            />
          </div>

          {/* Base Layer: Nighttime Room View */}
          <div
            className="absolute inset-0 transition-opacity duration-1000 ease-in-out pointer-events-none"
            style={{ opacity: isDay ? 0 : 1 }}
          >
            <Image
              src="/images/room/villa-interior-night.jpg"
              alt="Luxury Villa Living Room Nighttime 3000K Lighting"
              fill
              priority
              sizes="(max-width: 1280px) 100vw, 1280px"
              className="object-cover object-center"
            />
          </div>

          {/* Night Ambience Darkness Mask (when night and main lights are turned OFF) */}
          {!isDay && (
            <div
              className="absolute inset-0 bg-zinc-950 pointer-events-none transition-opacity duration-700 ease-out"
              style={{
                opacity: !downlightsOn && !coveOn && !wallWashOn ? 0.72 : 0,
              }}
            />
          )}

          {/* Exterior Pool/Landscape Light Wash (seen through floor-to-ceiling glass) */}
          {!isDay && poolLandscapeOn && (
            <div className="absolute inset-y-0 right-0 w-[45%] bg-gradient-to-l from-emerald-500/10 via-cyan-500/10 to-transparent pointer-events-none mix-blend-screen transition-opacity duration-500" />
          )}

          {/* ======================================================== */}
          {/* LAYER 1: Perimeter Linear Cove Lighting (Drop Ceiling) */}
          {/* ======================================================== */}
          <div
            className="absolute top-0 inset-x-0 h-[28%] pointer-events-none transition-opacity duration-400 ease-out"
            style={{
              opacity: coveOn ? (coveDimmer / 100) * 0.95 : 0,
            }}
          >
            {/* Top perimeter linear glow strip */}
            <div className="absolute top-0 inset-x-0 h-4 bg-gradient-to-b from-amber-300 via-amber-400/80 to-transparent blur-[2px]" />
            {/* Wide soft 3000K indirect wash across the crown & drop ceiling */}
            <div className="absolute top-0 inset-x-0 h-full bg-gradient-to-b from-amber-400/35 via-amber-500/15 to-transparent blur-xl mix-blend-screen" />
            <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-amber-300/40 to-transparent blur-md mix-blend-color-dodge" />
          </div>

          {/* ======================================================== */}
          {/* LAYER 2: Recessed COB Downlights (Spot Cones & Floor Pools) */}
          {/* ======================================================== */}
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-300 ease-out"
            style={{
              opacity: downlightsOn ? 1 : 0,
            }}
          >
            {/* Transient 50ms Solid-State Driver Inrush Flash */}
            {flashDownlights && (
              <div className="absolute inset-0 bg-amber-100/30 mix-blend-screen pointer-events-none" />
            )}

            {/* Recessed Spot #1 (Left Area) */}
            <div className="absolute top-[8%] left-[22%] -translate-x-1/2 flex flex-col items-center">
              <div className="w-5 h-2.5 rounded-full bg-amber-200 shadow-[0_0_24px_8px_rgba(251,191,36,0.95)]" />
              <div
                className="w-48 sm:w-80 h-72 sm:h-96 -mt-1 bg-gradient-to-b from-amber-300/45 via-amber-400/20 to-transparent blur-lg mix-blend-screen"
                style={{ clipPath: "polygon(40% 0%, 60% 0%, 100% 100%, 0% 100%)" }}
              />
            </div>

            {/* Recessed Spot #2 (Center-Left) */}
            <div className="absolute top-[7%] left-[42%] -translate-x-1/2 flex flex-col items-center">
              <div className="w-5 h-2.5 rounded-full bg-amber-200 shadow-[0_0_24px_8px_rgba(251,191,36,0.95)]" />
              <div
                className="w-52 sm:w-96 h-80 sm:h-[420px] -mt-1 bg-gradient-to-b from-amber-300/50 via-amber-400/20 to-transparent blur-lg mix-blend-screen"
                style={{ clipPath: "polygon(40% 0%, 60% 0%, 100% 100%, 0% 100%)" }}
              />
            </div>

            {/* Recessed Spot #3 (Center-Right Seating Area) */}
            <div className="absolute top-[7%] left-[62%] -translate-x-1/2 flex flex-col items-center">
              <div className="w-5 h-2.5 rounded-full bg-amber-200 shadow-[0_0_24px_8px_rgba(251,191,36,0.95)]" />
              <div
                className="w-56 sm:w-[420px] h-80 sm:h-[440px] -mt-1 bg-gradient-to-b from-amber-300/55 via-amber-400/22 to-transparent blur-lg mix-blend-screen"
                style={{ clipPath: "polygon(40% 0%, 60% 0%, 100% 100%, 0% 100%)" }}
              />
            </div>

            {/* Recessed Spot #4 (Right Lounge Corridor) */}
            <div className="absolute top-[8%] left-[82%] -translate-x-1/2 flex flex-col items-center">
              <div className="w-5 h-2.5 rounded-full bg-amber-200 shadow-[0_0_24px_8px_rgba(251,191,36,0.95)]" />
              <div
                className="w-48 sm:w-80 h-72 sm:h-96 -mt-1 bg-gradient-to-b from-amber-300/45 via-amber-400/20 to-transparent blur-lg mix-blend-screen"
                style={{ clipPath: "polygon(40% 0%, 60% 0%, 100% 100%, 0% 100%)" }}
              />
            </div>

            {/* Warm Reflection Pool across Italian Polished Micro-Cement Floor */}
            <div className="absolute bottom-[2%] inset-x-[15%] h-[32%] bg-gradient-to-t from-amber-500/20 via-amber-400/10 to-transparent blur-2xl mix-blend-screen pointer-events-none" />
          </div>

          {/* ======================================================== */}
          {/* LAYER 3: Modern Accent Wall-Wash Illumination */}
          {/* ======================================================== */}
          <div
            className="absolute top-[10%] left-[4%] w-48 sm:w-72 h-[60%] pointer-events-none transition-opacity duration-400 ease-out"
            style={{
              opacity: wallWashOn ? 0.85 : 0,
            }}
          >
            <div className="w-full h-full bg-gradient-to-br from-amber-300/40 via-amber-500/15 to-transparent blur-xl mix-blend-screen" />
          </div>

          {/* ======================================================== */}
          {/* LAYER 4: REAL BLDC CEILING FAN (3D Photorealistic Rotor) */}
          {/* Realistic aerodynamic blades, central motor, & inertia  */}
          {/* ======================================================== */}
          <div className="absolute top-[7%] left-[51%] -translate-x-1/2 pointer-events-none z-20 flex flex-col items-center">
            {/* Ceiling Mounting Canopy & Downrod */}
            <div className="w-3 h-9 bg-gradient-to-b from-zinc-800 to-zinc-950 border-x border-zinc-600/50 shadow-md" />
            <div className="w-9 h-3.5 rounded-full bg-zinc-900 border border-zinc-700 shadow-lg -mt-1" />

            {/* Real Photorealistic BLDC Fan Rotor Container */}
            <div className="relative w-48 sm:w-72 md:w-80 h-48 sm:h-72 md:h-80 -mt-20 flex items-center justify-center">
              {/* Spinning Fan Rotor */}
              <motion.div
                className="relative w-full h-full flex items-center justify-center"
                animate={fanOn ? { rotate: 360 } : { rotate: 0 }}
                transition={
                  fanOn
                    ? {
                        repeat: Infinity,
                        duration: fanRotationDuration,
                        ease: "linear",
                      }
                    : {
                        duration: 2.2,
                        ease: [0.1, 0.8, 0.25, 1], // Natural rotational inertia slowdown
                      }
                }
                style={{
                  filter:
                    fanOn && fanSpeed >= 4
                      ? "blur(1px) drop-shadow(0 14px 22px rgba(0,0,0,0.6))"
                      : "drop-shadow(0 14px 22px rgba(0,0,0,0.6))",
                }}
              >
                <div className="relative w-full h-full">
                  <Image
                    src="/images/room/real-fan.png"
                    alt="Real BLDC 3-Blade Luxury Ceiling Fan"
                    fill
                    priority
                    sizes="(max-width: 768px) 280px, 320px"
                    className="object-contain"
                  />
                </div>
              </motion.div>

              {/* Central Non-Rotating Motor LED Status Indicator */}
              <div className="absolute z-30 w-5 h-5 rounded-full bg-zinc-950/90 border border-zinc-700 shadow-md flex items-center justify-center pointer-events-none">
                <span
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                    fanOn
                      ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)] animate-pulse"
                      : "bg-zinc-600"
                  }`}
                />
              </div>
            </div>

            {/* Aerodynamic Airflow Ripple below Real Fan */}
            {fanOn && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.12, 0.35, 0.12] }}
                transition={{
                  repeat: Infinity,
                  duration: Math.max(0.6, fanRotationDuration * 1.4),
                  ease: "easeInOut",
                }}
                className="w-56 sm:w-80 h-44 -mt-24 bg-gradient-to-b from-sky-400/10 via-cyan-300/5 to-transparent blur-md mix-blend-screen pointer-events-none"
              />
            )}
          </div>

          {/* Real-time Telemetry Overlay (Top Left inside canvas) */}
          <div className="absolute top-4 left-4 z-30 pointer-events-none bg-zinc-950/75 backdrop-blur-md border border-zinc-800/80 rounded-2xl px-3 sm:px-4 py-2.5 shadow-xl text-left hidden sm:block">
            <div className="flex items-center gap-2 mb-1.5">
              <Zap size={14} className="text-amber-400 animate-pulse" />
              <span className="text-[11px] font-bold tracking-wider uppercase text-zinc-300">
                Electrical Telemetry
              </span>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
              <div>
                <span className="text-[10px] text-zinc-400 block">Total Active Load</span>
                <span className="text-sm font-bold text-amber-400 font-mono">
                  {activeLoadWatts} <span className="text-[10px] font-normal text-zinc-400">Watts</span>
                </span>
              </div>
              <div>
                <span className="text-[10px] text-zinc-400 block">System Voltage</span>
                <span className="text-sm font-bold text-emerald-400 font-mono">232V AC</span>
              </div>
              <div>
                <span className="text-[10px] text-zinc-400 block">Color Temperature</span>
                <span className="text-xs font-semibold text-zinc-200">3000K Warm</span>
              </div>
              <div>
                <span className="text-[10px] text-zinc-400 block">Wiring Standard</span>
                <span className="text-xs font-semibold text-zinc-200">IS:732 Concealed</span>
              </div>
            </div>
          </div>

          {/* Quick Presets Pill Bar (Bottom Left inside canvas) */}
          <div className="absolute bottom-4 left-4 z-30 flex items-center gap-1.5 flex-wrap max-w-[80%] sm:max-w-none">
            {[
              { id: "evening", label: "3000K Evening" },
              { id: "cinema", label: "Cinema Glow" },
              { id: "daylight", label: "Daylight" },
              { id: "all_on", label: "All On" },
              { id: "all_off", label: "All Off" },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => applyPreset(p.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md transition-all active:scale-95 ${
                  activePreset === p.id
                    ? "bg-amber-500 text-zinc-950 shadow-lg shadow-amber-500/20 font-bold"
                    : "bg-zinc-900/80 hover:bg-zinc-800/90 text-zinc-300 border border-zinc-700/60"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Floating Switchboard Dock Toggle Button (Mobile/Compact) */}
          <div className="absolute bottom-4 right-4 z-30">
            <button
              onClick={() => setIsSwitchboardExpanded(!isSwitchboardExpanded)}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-bold bg-amber-500 text-zinc-950 shadow-xl shadow-amber-500/30 hover:bg-amber-400 transition-all active:scale-95"
            >
              <Sliders size={14} />
              <span>{isSwitchboardExpanded ? "Hide Switchboard" : "Open Switchboard"}</span>
            </button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* INTERACTIVE MODULAR SWITCHBOARD (Wall Plate Interface)  */}
        {/* ======================================================== */}
        <AnimatePresence>
          {isSwitchboardExpanded && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="mt-6 w-full bg-zinc-900/90 backdrop-blur-xl border border-zinc-800 rounded-3xl p-5 sm:p-7 shadow-2xl relative overflow-hidden"
            >
              {/* Subtle top edge metallic highlight */}
              <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />

              <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-5 border-b border-zinc-800/80 gap-3">
                <div>
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-bold">
                      MODULAR GANG 6-WAY
                    </span>
                    <span className="text-[10px] bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded-full border border-zinc-700">
                      Flame Retardant Polycarbonate Plate
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white mt-1">
                    Architectural Wall Switch Plate Controls
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Click any switch rocker to flip circuits on/off with acoustic relay clicks.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-950/80 border border-zinc-800 text-xs font-mono text-zinc-300">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Grid: 230V · 50Hz</span>
                  </div>
                  <div className="px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-xs font-mono text-amber-400 font-semibold">
                    Load: {activeLoadWatts}W
                  </div>
                </div>
              </div>

              {/* Grid of Realistic Tactile Rocker Switches */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mt-6">
                {/* Switch 1: Downlights */}
                <div
                  onClick={() => handleToggle(setDownlightsOn, downlightsOn, true)}
                  className={`group relative rounded-2xl p-4 border transition-all duration-200 cursor-pointer select-none flex flex-col justify-between h-44 ${
                    downlightsOn
                      ? "bg-gradient-to-b from-zinc-800 to-zinc-900 border-amber-500/40 shadow-lg shadow-amber-500/5"
                      : "bg-zinc-950/80 border-zinc-800 hover:border-zinc-700"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-mono tracking-wider text-zinc-400 uppercase">
                      SW-01
                    </span>
                    <span
                      className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                        downlightsOn
                          ? "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.9)]"
                          : "bg-zinc-700"
                      }`}
                    />
                  </div>

                  <div className="my-2 flex justify-center">
                    <div
                      className={`w-14 h-16 rounded-xl border p-1 transition-all duration-150 flex flex-col justify-between ${
                        downlightsOn
                          ? "bg-gradient-to-b from-zinc-700 to-zinc-800 border-zinc-600 shadow-inner -translate-y-0.5"
                          : "bg-gradient-to-b from-zinc-900 to-zinc-950 border-zinc-800 shadow-md translate-y-0.5"
                      }`}
                    >
                      <div
                        className={`h-6 rounded-lg transition-all ${
                          downlightsOn
                            ? "bg-amber-500/20 border-b border-amber-500/30"
                            : "bg-zinc-800/40"
                        }`}
                      />
                      <div className="text-[9px] font-mono text-center font-bold text-zinc-400">
                        {downlightsOn ? "ON" : "OFF"}
                      </div>
                    </div>
                  </div>

                  <div>
                    <span className="text-xs font-bold text-zinc-100 block leading-tight">
                      COB Downlights
                    </span>
                    <span className="text-[10px] text-zinc-400 block mt-0.5">
                      4x 12W 3000K Spots
                    </span>
                  </div>
                </div>

                {/* Switch 2: Linear Cove */}
                <div
                  onClick={() => handleToggle(setCoveOn, coveOn)}
                  className={`group relative rounded-2xl p-4 border transition-all duration-200 cursor-pointer select-none flex flex-col justify-between h-44 ${
                    coveOn
                      ? "bg-gradient-to-b from-zinc-800 to-zinc-900 border-amber-500/40 shadow-lg shadow-amber-500/5"
                      : "bg-zinc-950/80 border-zinc-800 hover:border-zinc-700"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-mono tracking-wider text-zinc-400 uppercase">
                      SW-02
                    </span>
                    <span
                      className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                        coveOn
                          ? "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.9)]"
                          : "bg-zinc-700"
                      }`}
                    />
                  </div>

                  <div className="my-2 flex justify-center">
                    <div
                      className={`w-14 h-16 rounded-xl border p-1 transition-all duration-150 flex flex-col justify-between ${
                        coveOn
                          ? "bg-gradient-to-b from-zinc-700 to-zinc-800 border-zinc-600 shadow-inner -translate-y-0.5"
                          : "bg-gradient-to-b from-zinc-900 to-zinc-950 border-zinc-800 shadow-md translate-y-0.5"
                      }`}
                    >
                      <div
                        className={`h-6 rounded-lg transition-all ${
                          coveOn
                            ? "bg-amber-500/20 border-b border-amber-500/30"
                            : "bg-zinc-800/40"
                        }`}
                      />
                      <div className="text-[9px] font-mono text-center font-bold text-zinc-400">
                        {coveOn ? "ON" : "OFF"}
                      </div>
                    </div>
                  </div>

                  <div>
                    <span className="text-xs font-bold text-zinc-100 block leading-tight">
                      Cove Profile
                    </span>
                    <span className="text-[10px] text-zinc-400 block mt-0.5">
                      Drop Ceiling LED
                    </span>
                  </div>
                </div>

                {/* Switch 3: REAL BLDC Fan */}
                <div
                  onClick={() => handleToggle(setFanOn, fanOn)}
                  className={`group relative rounded-2xl p-4 border transition-all duration-200 cursor-pointer select-none flex flex-col justify-between h-44 ${
                    fanOn
                      ? "bg-gradient-to-b from-zinc-800 to-zinc-900 border-emerald-500/40 shadow-lg shadow-emerald-500/5"
                      : "bg-zinc-950/80 border-zinc-800 hover:border-zinc-700"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-mono tracking-wider text-zinc-400 uppercase">
                      SW-03
                    </span>
                    <span
                      className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                        fanOn
                          ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]"
                          : "bg-zinc-700"
                      }`}
                    />
                  </div>

                  <div className="my-2 flex justify-center">
                    <div
                      className={`w-14 h-16 rounded-xl border p-1 transition-all duration-150 flex flex-col justify-between ${
                        fanOn
                          ? "bg-gradient-to-b from-zinc-700 to-zinc-800 border-zinc-600 shadow-inner -translate-y-0.5"
                          : "bg-gradient-to-b from-zinc-900 to-zinc-950 border-zinc-800 shadow-md translate-y-0.5"
                      }`}
                    >
                      <div
                        className={`h-6 rounded-lg transition-all ${
                          fanOn
                            ? "bg-emerald-500/20 border-b border-emerald-500/30"
                            : "bg-zinc-800/40"
                        }`}
                      />
                      <div className="text-[9px] font-mono text-center font-bold text-zinc-400">
                        {fanOn ? "ON" : "OFF"}
                      </div>
                    </div>
                  </div>

                  <div>
                    <span className="text-xs font-bold text-zinc-100 block leading-tight">
                      BLDC Ceiling Fan
                    </span>
                    <span className="text-[10px] text-zinc-400 block mt-0.5">
                      3-Blade Motor (Spd {fanSpeed})
                    </span>
                  </div>
                </div>

                {/* Switch 4: Wall Washer / Art Spot */}
                <div
                  onClick={() => handleToggle(setWallWashOn, wallWashOn)}
                  className={`group relative rounded-2xl p-4 border transition-all duration-200 cursor-pointer select-none flex flex-col justify-between h-44 ${
                    wallWashOn
                      ? "bg-gradient-to-b from-zinc-800 to-zinc-900 border-amber-500/40 shadow-lg shadow-amber-500/5"
                      : "bg-zinc-950/80 border-zinc-800 hover:border-zinc-700"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-mono tracking-wider text-zinc-400 uppercase">
                      SW-04
                    </span>
                    <span
                      className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                        wallWashOn
                          ? "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.9)]"
                          : "bg-zinc-700"
                      }`}
                    />
                  </div>

                  <div className="my-2 flex justify-center">
                    <div
                      className={`w-14 h-16 rounded-xl border p-1 transition-all duration-150 flex flex-col justify-between ${
                        wallWashOn
                          ? "bg-gradient-to-b from-zinc-700 to-zinc-800 border-zinc-600 shadow-inner -translate-y-0.5"
                          : "bg-gradient-to-b from-zinc-900 to-zinc-950 border-zinc-800 shadow-md translate-y-0.5"
                      }`}
                    >
                      <div
                        className={`h-6 rounded-lg transition-all ${
                          wallWashOn
                            ? "bg-amber-500/20 border-b border-amber-500/30"
                            : "bg-zinc-800/40"
                        }`}
                      />
                      <div className="text-[9px] font-mono text-center font-bold text-zinc-400">
                        {wallWashOn ? "ON" : "OFF"}
                      </div>
                    </div>
                  </div>

                  <div>
                    <span className="text-xs font-bold text-zinc-100 block leading-tight">
                      Accent Wash
                    </span>
                    <span className="text-[10px] text-zinc-400 block mt-0.5">
                      Fluted Teak Wall Spot
                    </span>
                  </div>
                </div>

                {/* Switch 5: Exterior Glass Pool Lights */}
                <div
                  onClick={() => handleToggle(setPoolLandscapeOn, poolLandscapeOn)}
                  className={`group relative rounded-2xl p-4 border transition-all duration-200 cursor-pointer select-none flex flex-col justify-between h-44 ${
                    poolLandscapeOn
                      ? "bg-gradient-to-b from-zinc-800 to-zinc-900 border-cyan-500/40 shadow-lg shadow-cyan-500/5"
                      : "bg-zinc-950/80 border-zinc-800 hover:border-zinc-700"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-mono tracking-wider text-zinc-400 uppercase">
                      SW-05
                    </span>
                    <span
                      className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                        poolLandscapeOn
                          ? "bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.9)]"
                          : "bg-zinc-700"
                      }`}
                    />
                  </div>

                  <div className="my-2 flex justify-center">
                    <div
                      className={`w-14 h-16 rounded-xl border p-1 transition-all duration-150 flex flex-col justify-between ${
                        poolLandscapeOn
                          ? "bg-gradient-to-b from-zinc-700 to-zinc-800 border-zinc-600 shadow-inner -translate-y-0.5"
                          : "bg-gradient-to-b from-zinc-900 to-zinc-950 border-zinc-800 shadow-md translate-y-0.5"
                      }`}
                    >
                      <div
                        className={`h-6 rounded-lg transition-all ${
                          poolLandscapeOn
                            ? "bg-cyan-500/20 border-b border-cyan-500/30"
                            : "bg-zinc-800/40"
                        }`}
                      />
                      <div className="text-[9px] font-mono text-center font-bold text-zinc-400">
                        {poolLandscapeOn ? "ON" : "OFF"}
                      </div>
                    </div>
                  </div>

                  <div>
                    <span className="text-xs font-bold text-zinc-100 block leading-tight">
                      Pool Landscape
                    </span>
                    <span className="text-[10px] text-zinc-400 block mt-0.5">
                      IP65 Exterior Garden
                    </span>
                  </div>
                </div>

                {/* Switch 6: Master Isolator Switch */}
                <div
                  onClick={() => {
                    const allAreOn = downlightsOn && coveOn && fanOn && wallWashOn;
                    playMechanicalClick(isMuted, allAreOn ? "off" : "on");
                    const target = !allAreOn;
                    setDownlightsOn(target);
                    setCoveOn(target);
                    setFanOn(target);
                    setWallWashOn(target);
                    setPoolLandscapeOn(target);
                    setActivePreset(target ? "all_on" : "all_off");
                  }}
                  className={`group relative rounded-2xl p-4 border transition-all duration-200 cursor-pointer select-none flex flex-col justify-between h-44 ${
                    downlightsOn || coveOn || fanOn
                      ? "bg-gradient-to-b from-zinc-800 to-zinc-900 border-red-500/40 shadow-lg shadow-red-500/5"
                      : "bg-zinc-950/80 border-zinc-800 hover:border-zinc-700"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-mono tracking-wider text-zinc-400 uppercase">
                      MASTER
                    </span>
                    <span
                      className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                        downlightsOn || coveOn || fanOn
                          ? "bg-red-400 shadow-[0_0_8px_rgba(248,113,113,0.9)]"
                          : "bg-zinc-700"
                      }`}
                    />
                  </div>

                  <div className="my-2 flex justify-center">
                    <div
                      className={`w-14 h-16 rounded-xl border p-1 transition-all duration-150 flex flex-col justify-between ${
                        downlightsOn || coveOn || fanOn
                          ? "bg-gradient-to-b from-red-950/40 to-zinc-800 border-red-500/30 shadow-inner -translate-y-0.5"
                          : "bg-gradient-to-b from-zinc-900 to-zinc-950 border-zinc-800 shadow-md translate-y-0.5"
                      }`}
                    >
                      <div
                        className={`h-6 rounded-lg transition-all ${
                          downlightsOn || coveOn || fanOn
                            ? "bg-red-500/20 border-b border-red-500/30"
                            : "bg-zinc-800/40"
                        }`}
                      />
                      <div className="text-[9px] font-mono text-center font-bold text-zinc-400">
                        {downlightsOn || coveOn || fanOn ? "ON" : "OFF"}
                      </div>
                    </div>
                  </div>

                  <div>
                    <span className="text-xs font-bold text-zinc-100 block leading-tight">
                      Master Power
                    </span>
                    <span className="text-[10px] text-zinc-400 block mt-0.5">
                      Isolate All Circuits
                    </span>
                  </div>
                </div>
              </div>

              {/* Auxiliary Regulators: BLDC Speed Regulator & Cove Dimmer */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-5 border-t border-zinc-800/80">
                {/* BLDC Fan 5-Step Regulator */}
                <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-2xl p-4 flex flex-col justify-between gap-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Wind size={16} className="text-emerald-400" />
                      <span className="text-xs font-bold text-zinc-200">
                        BLDC Electronic Speed Regulator
                      </span>
                    </div>
                    <span className="text-xs font-mono font-bold text-emerald-400">
                      {fanOn ? `Speed ${fanSpeed} · ${[0, 110, 160, 220, 280, 340][fanSpeed]} RPM` : "Fan OFF"}
                    </span>
                  </div>

                  {/* 5-Step Tactical Buttons */}
                  <div className="flex items-center gap-2">
                    {([1, 2, 3, 4, 5] as const).map((spd) => (
                      <button
                        key={spd}
                        onClick={() => {
                          playMechanicalClick(isMuted, "on");
                          setFanOn(true);
                          setFanSpeed(spd);
                        }}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 border ${
                          fanOn && fanSpeed === spd
                            ? "bg-emerald-500 text-zinc-950 border-emerald-400 shadow-md shadow-emerald-500/20"
                            : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-white"
                        }`}
                      >
                        {spd}
                      </button>
                    ))}
                  </div>
                  <p className="text-[11px] text-zinc-400">
                    BEE 5-Star Brushless DC motor: draws only 28W max vs 75W standard induction fan.
                  </p>
                </div>

                {/* Cove Lighting Stepless Dimmer */}
                <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-2xl p-4 flex flex-col justify-between gap-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sliders size={16} className="text-amber-400" />
                      <span className="text-xs font-bold text-zinc-200">
                        Drop Ceiling Cove Dimmer
                      </span>
                    </div>
                    <span className="text-xs font-mono font-bold text-amber-400">
                      {coveOn ? `${coveDimmer}% Luminosity` : "Cove OFF"}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-mono text-zinc-400">10%</span>
                    <input
                      type="range"
                      min={10}
                      max={100}
                      value={coveDimmer}
                      disabled={!coveOn}
                      onChange={(e) => {
                        setCoveDimmer(Number(e.target.value));
                        setActivePreset("custom");
                      }}
                      className="w-full accent-amber-500 h-2 bg-zinc-800 rounded-lg cursor-pointer disabled:opacity-40"
                    />
                    <span className="text-[10px] font-mono text-zinc-400">100%</span>
                  </div>
                  <p className="text-[11px] text-zinc-400">
                    Stepless 0-10V / DALI architectural dimmer driver for flicker-free 3000K mood control.
                  </p>
                </div>
              </div>

              {/* Contracting Call to Action banner */}
              <div className="mt-6 pt-5 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 bg-amber-500/5 rounded-2xl p-4 border border-amber-500/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">
                      Want this exact electrical installation in your villa or bungalow?
                    </h4>
                    <p className="text-xs text-zinc-400">
                      We execute concealed copper conduit routing, DB panels, modular plates &amp; 3000K lighting.
                    </p>
                  </div>
                </div>

                <Link
                  href="/contracting"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs tracking-wide uppercase transition-all shadow-lg shadow-amber-500/20 active:scale-95 shrink-0"
                >
                  <span>Book Contracting Consultation</span>
                  <ChevronRight size={14} />
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
