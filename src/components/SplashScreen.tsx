"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SplashScreenProps {
  children?: React.ReactNode;
  /** Splash screen display duration in milliseconds (default: 2500ms) */
  duration?: number;
  /** Whether to show the splash screen only once per browser session */
  oncePerSession?: boolean;
}

export function SplashScreen({
  children,
  duration = 2500,
  oncePerSession = false,
}: SplashScreenProps) {
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    setMounted(true);

    if (oncePerSession) {
      const hasShown = sessionStorage.getItem("splash_screen_shown");
      if (hasShown) {
        setIsVisible(false);
        return;
      }
      sessionStorage.setItem("splash_screen_shown", "true");
    }

    // Prevent scrolling while the splash screen is active
    document.body.style.overflow = "hidden";

    const timer = setTimeout(() => {
      setIsVisible(false);
      document.body.style.overflow = "";
    }, duration);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = "";
    };
  }, [duration, oncePerSession]);

  return (
    <>
      {/* Underlying layout/page content */}
      {children}

      {/* Splash Screen Overlay */}
      <AnimatePresence mode="wait">
        {isVisible && (
          <motion.aside
            key="splash-screen"
            aria-label="Loading Jay Ganesh Electrical"
            initial={{ opacity: 1 }}
            exit={{
              opacity: 0,
              scale: 1.04,
              filter: "blur(12px)",
              transition: {
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1], // Smooth cinematic ease-out
              },
            }}
            className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-background select-none overflow-hidden touch-none px-4"
          >
            {/* Ambient dynamic radial backlight glow (responsive on all devices) */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
              <motion.div
                animate={{
                  scale: [1, 1.15, 1],
                  opacity: [0.35, 0.6, 0.35],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="w-[280px] h-[280px] sm:w-[420px] sm:h-[420px] md:w-[540px] md:h-[540px] rounded-full bg-gradient-to-tr from-[#D4A843]/25 via-[#3B82F6]/15 to-transparent blur-3xl"
              />
            </div>

            {/* Central Content Container (Responsive for Laptop, Tablet, Mobile) */}
            <div className="relative z-10 flex flex-col items-center justify-center max-w-lg w-full">
              
              {/* Pure 3D Floating Logo (NO ring, NO background box) */}
              <motion.div
                initial={{ opacity: 0, scale: 0.85, y: 15 }}
                animate={{
                  opacity: 1,
                  scale: [1, 1.03, 1],
                  y: [-8, 8, -8],
                  rotateY: [-4, 4, -4],
                  rotateX: [2, -2, 2],
                }}
                transition={{
                  opacity: { duration: 0.6, ease: "easeOut" },
                  scale: { duration: 3.2, repeat: Infinity, ease: "easeInOut" },
                  y: { duration: 2.8, repeat: Infinity, ease: "easeInOut" },
                  rotateY: { duration: 3.5, repeat: Infinity, ease: "easeInOut" },
                  rotateX: { duration: 2.5, repeat: Infinity, ease: "easeInOut" },
                }}
                style={{
                  perspective: 1000,
                  transformStyle: "preserve-3d",
                }}
                className="relative flex items-center justify-center"
              >
                {/* Transparent Logo image without background */}
                <img
                  src="/logo.png"
                  alt="Jay Ganesh Electrical"
                  className="w-32 h-auto sm:w-40 md:w-48 lg:w-56 max-h-[35vh] object-contain select-none filter drop-shadow-[0_12px_24px_rgba(212,168,67,0.25)] dark:drop-shadow-[0_14px_28px_rgba(212,168,67,0.35)]"
                  loading="eager"
                  draggable={false}
                />
              </motion.div>

              {/* Shop Name & Subtitle */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.7, ease: "easeOut" }}
                className="mt-6 sm:mt-8 flex flex-col items-center text-center px-2"
              >
                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-wider font-heading uppercase text-foreground">
                  Jay Ganesh Electrical
                </h1>
                
                <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm md:text-base font-semibold tracking-widest text-muted-foreground uppercase opacity-85">
                  Premium Supply &amp; Contracting
                </p>

                {/* Responsive Animated Progress Bar */}
                <div className="mt-6 sm:mt-7 w-44 sm:w-56 md:w-64 h-1 sm:h-1.5 bg-foreground/10 rounded-full overflow-hidden shadow-inner">
                  <motion.div
                    className="h-full bg-gradient-to-r from-[#D4A843] via-[#3B82F6] to-[#D4A843] rounded-full"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{
                      duration: duration / 1000,
                      ease: "easeInOut",
                    }}
                  />
                </div>
              </motion.div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}

export default SplashScreen;
