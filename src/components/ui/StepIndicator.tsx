"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface StepIndicatorProps {
  steps: string[];
  currentStep: number; // 0-indexed
  className?: string;
}

export function StepIndicator({ steps, currentStep, className }: StepIndicatorProps) {
  return (
    <div className={cn("w-full py-4", className)}>
      <div className="flex items-center justify-between relative">
        {/* Background line */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-200 dark:bg-slate-800 rounded-full z-0" />
        
        {/* Animated progress line */}
        <motion.div 
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-brand-blue rounded-full z-0"
          initial={{ width: "0%" }}
          animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />

        {/* Steps */}
        {steps.map((step, index) => {
          const isCompleted = currentStep > index;
          const isActive = currentStep === index;
          
          return (
            <div key={step} className="relative z-10 flex flex-col items-center gap-2">
              <motion.div
                initial={false}
                animate={{
                  backgroundColor: isCompleted || isActive ? "var(--color-brand-blue)" : "var(--color-background)",
                  borderColor: isCompleted || isActive ? "var(--color-brand-blue)" : "var(--color-slate-300)",
                  scale: isActive ? 1.2 : 1
                }}
                className={cn(
                  "w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors duration-300",
                  !isCompleted && !isActive && "bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700"
                )}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4 text-white" />
                ) : (
                  <span className={cn(
                    "text-sm font-semibold",
                    isActive ? "text-white" : "text-slate-500 dark:text-slate-400"
                  )}>
                    {index + 1}
                  </span>
                )}
              </motion.div>
              <span className={cn(
                "text-xs font-medium absolute -bottom-6 w-24 text-center",
                isActive ? "text-foreground" : "text-slate-500 dark:text-slate-400"
              )}>
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
