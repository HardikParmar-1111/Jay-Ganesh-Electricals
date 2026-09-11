"use client";

import React from "react";
import { motion } from "framer-motion";

interface LogoProps {
  theme?: "light" | "dark" | "auto";
  className?: string;
  size?: number;
  priority?: boolean;
}

export function Logo({
  className = "",
  size = 48,
}: LogoProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={`relative flex items-center justify-center rounded-2xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-md shadow-sm border border-amber-500/20 dark:border-amber-400/20 p-1.5 overflow-hidden transition-all duration-300 hover:border-amber-500/40 hover:shadow-amber-500/10 ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Subtle gold ambient glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/10 via-transparent to-amber-300/10 pointer-events-none rounded-2xl" />
      
      <img 
        src="/logo.png" 
        alt="Jay Ganesh Electrical" 
        className="w-full h-full object-contain filter drop-shadow-sm select-none"
        loading="eager"
      />
    </motion.div>
  );
}
