import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "glass" | "outline";
  interactive?: boolean;
  selected?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "default", interactive = false, selected = false, ...props }, ref) => {
    const baseStyles = "squircle overflow-hidden";
    
    const variants = {
      default: "bg-white dark:bg-zinc-900 shadow-sm border border-zinc-200 dark:border-zinc-800",
      glass: "glass",
      outline: "bg-transparent border-2 border-zinc-200 dark:border-zinc-800",
    };

    const interactiveStyles = interactive
      ? "transition-all hover:-translate-y-1 hover:shadow-md cursor-pointer"
      : "";

    const selectedStyles = selected
      ? "ring-2 ring-brand-blue border-brand-blue shadow-md shadow-brand-blue/10 bg-brand-blue/5 dark:bg-brand-blue/10"
      : "";

    return (
      <div
        ref={ref}
        className={cn(baseStyles, variants[variant], interactiveStyles, selectedStyles, className)}
        {...props}
      />
    );
  }
);
Card.displayName = "Card";

export const MotionCard = motion.create(Card);
