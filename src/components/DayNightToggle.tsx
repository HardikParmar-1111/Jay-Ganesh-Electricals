"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";

interface DayNightToggleProps {
  className?: string;
}

export function DayNightToggle({ className = "" }: DayNightToggleProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className={`w-[60px] h-[30px] rounded-full bg-zinc-800/60 border border-zinc-700/50 ${className}`}
      />
    );
  }

  const isDark = (resolvedTheme || theme) === "dark";

  const handleToggle = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={isDark ? "Switch to daylight mode" : "Switch to night mode"}
      className={`group relative w-[60px] h-[30px] rounded-full p-1 cursor-pointer select-none outline-none overflow-hidden border transition-all duration-300 shadow-md ${
        isDark
          ? "border-zinc-700/70 shadow-black/40"
          : "border-sky-300/80 shadow-sky-900/10"
      } ${className}`}
      style={{
        background: isDark
          ? "linear-gradient(135deg, #1b2432 0%, #2a374a 100%)"
          : "linear-gradient(135deg, #3a97ea 0%, #68bbf8 100%)",
      }}
    >
      {/* ======================================================== */}
      {/* NIGHT SKY ELEMENTS (Stars & Concentric Aura Rings)       */}
      {/* ======================================================== */}
      <AnimatePresence>
        {isDark && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="absolute inset-0 pointer-events-none"
          >
            {/* Concentric Lunar Aura Rings */}
            <div className="absolute right-[-15px] top-1/2 -translate-y-1/2 w-16 h-16 rounded-full border border-sky-300/10 pointer-events-none" />
            <div className="absolute right-[-24px] top-1/2 -translate-y-1/2 w-24 h-24 rounded-full border border-sky-300/5 pointer-events-none" />

            {/* Twinkling Star 1 (Top Left) */}
            <motion.span
              animate={{ opacity: [0.4, 1, 0.4], scale: [0.85, 1.15, 0.85] }}
              transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
              className="absolute left-[12px] top-[7px] block w-[3px] h-[3px] bg-white rounded-full shadow-[0_0_4px_#fff]"
            />

            {/* Twinkling Star 2 (Center Left) */}
            <motion.span
              animate={{ opacity: [0.8, 0.3, 0.8], scale: [1, 0.75, 1] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut", delay: 0.4 }}
              className="absolute left-[20px] top-[14px] block w-[2px] h-[2px] bg-white rounded-full shadow-[0_0_3px_#fff]"
            />

            {/* Twinkling Star 3 (Bottom Left) */}
            <motion.span
              animate={{ opacity: [0.3, 0.9, 0.3], scale: [0.8, 1.2, 0.8] }}
              transition={{ repeat: Infinity, duration: 2.6, ease: "easeInOut", delay: 0.8 }}
              className="absolute left-[10px] bottom-[7px] block w-[2.5px] h-[2.5px] bg-white rounded-full shadow-[0_0_3px_#fff]"
            />

            {/* 4-Point Star Sparkle */}
            <motion.svg
              animate={{ opacity: [0.4, 1, 0.4], scale: [0.8, 1.1, 0.8] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut", delay: 0.2 }}
              viewBox="0 0 16 16"
              className="absolute left-[24px] top-[6px] w-[5px] h-[5px] text-white fill-current"
            >
              <path d="M8 0L9.5 6.5L16 8L9.5 9.5L8 16L6.5 9.5L0 8L6.5 6.5L8 0Z" />
            </motion.svg>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ======================================================== */}
      {/* DAY SKY ELEMENTS (Fluffy White Clouds)                   */}
      {/* ======================================================== */}
      <AnimatePresence>
        {!isDark && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="absolute inset-0 pointer-events-none"
          >
            {/* Cloud Puffs Stack on Right Side */}
            {/* Back Cloud Base */}
            <div className="absolute right-[2px] bottom-[-2px] w-[26px] h-[14px] bg-white/70 rounded-full" />
            {/* Back Cloud Puff 1 */}
            <div className="absolute right-[12px] bottom-[3px] w-[14px] h-[14px] bg-white/70 rounded-full" />
            {/* Front Cloud Base */}
            <div className="absolute right-[0px] bottom-[-4px] w-[32px] h-[15px] bg-white rounded-full shadow-sm" />
            {/* Front Cloud Puff Center */}
            <div className="absolute right-[8px] bottom-[2px] w-[15px] h-[15px] bg-white rounded-full" />
            {/* Front Cloud Puff Right */}
            <div className="absolute right-[18px] bottom-[0px] w-[11px] h-[11px] bg-white rounded-full" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ======================================================== */}
      {/* THE CELESTIAL ORB (Sun -> Moon Morphing Slider)         */}
      {/* ======================================================== */}
      <motion.div
        layout
        transition={{
          type: "spring",
          stiffness: 420,
          damping: 28,
        }}
        className="relative z-10 w-[22px] h-[22px] rounded-full"
        style={{
          transform: isDark ? "translateX(30px)" : "translateX(0px)",
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {!isDark ? (
            /* --- THE GOLDEN SUN --- */
            <motion.div
              key="sun"
              initial={{ scale: 0.6, rotate: -60, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              exit={{ scale: 0.6, rotate: 60, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="w-full h-full rounded-full shadow-[0_2px_5px_rgba(0,0,0,0.25)] relative overflow-hidden"
              style={{
                background: "radial-gradient(circle at 35% 35%, #FFF176 0%, #FBC02D 70%, #F57F17 100%)",
                boxShadow: "0 2px 6px rgba(245, 127, 23, 0.4), inset 0 -1px 2px rgba(0,0,0,0.15)",
              }}
            />
          ) : (
            /* --- THE CRATERED MOON WITH CRESCENT SHADOW --- */
            <motion.div
              key="moon"
              initial={{ scale: 0.6, rotate: 60, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              exit={{ scale: 0.6, rotate: -60, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="w-full h-full rounded-full relative overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #d8e2ec 0%, #b4c3d4 60%, #90a4ae 100%)",
                boxShadow: "0 2px 5px rgba(0,0,0,0.4), inset 0 1px 1px rgba(255,255,255,0.6)",
              }}
            >
              {/* Golden Crescent Edge Rim */}
              <div
                className="absolute left-[-2px] inset-y-0 w-[5px] rounded-full pointer-events-none opacity-80"
                style={{
                  background: "radial-gradient(circle, #FBC02D 0%, transparent 80%)",
                }}
              />

              {/* Crater 1 (Large, top right) */}
              <div className="absolute right-[5px] top-[4px] w-[6px] h-[6px] rounded-full bg-[#8297aa]/50 shadow-[inset_0_1px_1px_rgba(0,0,0,0.3)]" />

              {/* Crater 2 (Medium, bottom center) */}
              <div className="absolute right-[8px] bottom-[4px] w-[4.5px] h-[4.5px] rounded-full bg-[#8297aa]/50 shadow-[inset_0_1px_1px_rgba(0,0,0,0.3)]" />

              {/* Crater 3 (Small, left center) */}
              <div className="absolute left-[5px] top-[10px] w-[3px] h-[3px] rounded-full bg-[#8297aa]/40 shadow-[inset_0_1px_1px_rgba(0,0,0,0.3)]" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Subtle Inset Vignette Shadow */}
      <div className="pointer-events-none absolute inset-0 rounded-full shadow-[inset_0_1px_3px_rgba(0,0,0,0.3)]" />
    </button>
  );
}

export default DayNightToggle;
