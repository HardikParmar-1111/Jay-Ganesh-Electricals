"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import type { ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

/* ==========================================================================
   Types
   ========================================================================== */

export interface NavItem {
  label: string;
  href: string;
}

export interface ComponentProps {
  brandName: string;
  /** Shown before the brand name. Without it, the first letter of the name is used. */
  brandIcon?: ReactNode;
  navItems: NavItem[];
  ctaLabel: string;
  onCtaClick: () => void;
  /** Where the brand links to. Default "#", which scrolls to the top. */
  brandHref?: string;
  /** Marks a link as the current page. Leave it out and the navbar keeps track itself. */
  activeHref?: string;
  /** Which link starts as the current one when the navbar keeps track itself. Default is the first. */
  defaultActiveHref?: string;
  /** Called when a link is clicked. */
  onNavigate?: (href: string) => void;
  /** For links like "#features": highlight the one whose section is on screen as you scroll. */
  trackSections?: boolean;
  /** How the navbar sits on the page. Default "fixed". */
  position?: "fixed" | "sticky" | "absolute" | "static";
  className?: string;
}

interface NavLinksProps {
  items: NavItem[];
  active: string;
  hovered: string | null;
  layoutId: string;
  vertical?: boolean;
  reduceMotion: boolean;
  onHover: (href: string | null) => void;
  onSelect: (href: string) => void;
}

// end of types


/* ==========================================================================
   Constants and helpers
   ========================================================================== */

// Written out in full so Tailwind can see every class
const POSITION: Record<NonNullable<ComponentProps["position"]>, string> = {
  fixed: "fixed inset-x-0 top-3 sm:top-4",
  sticky: "sticky top-3 sm:top-4",
  absolute: "absolute inset-x-0 top-3 sm:top-4",
  static: "relative mt-3",
};

const SPRING = { type: "spring", stiffness: 420, damping: 34, mass: 0.8 } as const;

// Join class names, skipping anything falsy
function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

// end of constants and helpers


/* ==========================================================================
   NavLinks: a list of links with a pill that slides to the one you point at, or the current one
   ========================================================================== */

function NavLinks({ items, active, hovered, layoutId, vertical = false, reduceMotion, onHover, onSelect }: NavLinksProps) {
  // The pill sits on the link you are pointing at, and goes back to the current link when you move away
  const highlighted = hovered ?? active;

  return (
    <ul role="list" className={cn("flex", vertical ? "flex-col gap-1" : "items-center gap-1")}>
      {items.map((item) => {
        const isActive = item.href === active;
        const isHighlighted = item.href === highlighted;

        return (
          <li key={item.href}>
            <a
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              onClick={() => onSelect(item.href)}
              onPointerEnter={(e) => e.pointerType === "mouse" && onHover(item.href)}
              onPointerLeave={() => onHover(null)}
              onFocus={() => onHover(item.href)}
              onBlur={() => onHover(null)}
              className={cn(
                "relative isolate flex items-center rounded-full px-4 py-2 text-sm font-medium outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-ring",
                vertical && "py-3",
                isHighlighted ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {isHighlighted && (
                <motion.span
                  layoutId={layoutId}
                  aria-hidden="true"
                  transition={reduceMotion ? { duration: 0 } : SPRING}
                  className="absolute inset-0 -z-10 rounded-full bg-accent"
                />
              )}
              {item.label}
              {isActive && <span aria-hidden="true" className="ml-2 h-1.5 w-1.5 rounded-full bg-primary" />}
            </a>
          </li>
        );
      })}
    </ul>
  );
}

// end of NavLinks


/* ==========================================================================
   Component
   ========================================================================== */

export function Component({
  brandName,
  brandIcon,
  navItems,
  ctaLabel,
  onCtaClick,
  brandHref = "#",
  activeHref,
  defaultActiveHref,
  onNavigate,
  trackSections = false,
  position = "fixed",
  className,
}: ComponentProps) {
  // ---- State ----
  const [internalActive, setInternalActive] = useState(defaultActiveHref ?? navItems[0]?.href ?? "");
  const [hovered, setHovered] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  // end of state

  // ---- Refs and ids ----
  const rootRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const desktopId = useId();
  const mobileId = useId();
  const panelId = useId();
  // end of refs and ids

  const reduceMotion = useReducedMotion() ?? false;
  const active = activeHref ?? internalActive;

  const handleSelect = useCallback(
    (href: string) => {
      setInternalActive(href);
      setOpen(false);
      onNavigate?.(href);
    },
    [onNavigate]
  );

  // ---- A little more shadow once the page has scrolled ----
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  // end of scroll shadow

  // ---- Follow the page: highlight the link whose section is in view ----
  useEffect(() => {
    if (!trackSections) return;

    const sections = navItems
      .map((item) => item.href)
      .filter((href) => href.startsWith("#") && href.length > 1)
      .map((href) => document.getElementById(href.slice(1)))
      .filter((el): el is HTMLElement => el !== null);
    if (sections.length === 0) return;

    // Only the band across the middle of the screen counts, so the answer changes at a sensible moment
    const observer = new IntersectionObserver(
      (entries) => {
        const inView = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (inView) setInternalActive(`#${inView.target.id}`);
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: [0, 0.25, 0.5, 1] }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [trackSections, navItems]);
  // end of following the page

  // ---- The small-screen menu: close it on Escape, on an outside click, and when the screen grows ----
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    const onPointerDown = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const wide = window.matchMedia("(min-width: 768px)");
    const onResize = (e: MediaQueryListEvent) => e.matches && setOpen(false);

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    wide.addEventListener("change", onResize);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
      wide.removeEventListener("change", onResize);
    };
  }, [open]);
  // end of the small-screen menu

  const ctaClasses =
    "inline-flex h-10 items-center justify-center rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground shadow-sm outline-none transition-all duration-200 hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.97]";

  return (
    <header className={cn("pointer-events-none z-50 flex justify-center px-3", POSITION[position], className)}>
      <motion.div
        ref={rootRef}
        initial={reduceMotion ? false : { y: -28, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 260, damping: 26, delay: 0.1 }}
        className="pointer-events-auto relative w-full max-w-md md:w-auto md:max-w-none"
      >
        <nav
          aria-label="Main"
          className={cn(
            "relative flex items-center justify-between gap-2 rounded-full border border-border px-2 py-2 backdrop-blur-xl backdrop-saturate-150 transition-[background-color,box-shadow] duration-300 md:gap-4",
            scrolled ? "bg-background/90 shadow-xl shadow-black/10" : "bg-background/80 shadow-lg shadow-black/5"
          )}
        >
          {/* Thin light along the top edge of the pill */}
          <span aria-hidden="true" className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-foreground/20 to-transparent" />

          {/* Brand */}
          <a
            href={brandHref}
            className="flex items-center gap-2.5 rounded-full py-1 pl-1 pr-3 text-sm font-semibold tracking-tight text-foreground outline-none transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
              {brandIcon ?? <span aria-hidden="true">{brandName.charAt(0).toUpperCase()}</span>}
            </span>
            {brandName}
          </a>

          {/* Links, from tablets up */}
          <div className="hidden md:block">
            <NavLinks items={navItems} active={active} hovered={hovered} layoutId={`nav-pill-${desktopId}`} reduceMotion={reduceMotion} onHover={setHovered} onSelect={handleSelect} />
          </div>

          {/* Button, from tablets up */}
          <button type="button" onClick={onCtaClick} className={cn(ctaClasses, "hidden md:inline-flex")}>
            {ctaLabel}
          </button>

          {/* Menu button, on small screens */}
          <button
            ref={toggleRef}
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls={panelId}
            aria-label={open ? "Close menu" : "Open menu"}
            className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-foreground outline-none transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring md:hidden"
          >
            <span aria-hidden="true" className="relative block h-3.5 w-5">
              <span className={cn("absolute left-0 block h-0.5 w-5 rounded-full bg-current transition-all duration-300 motion-reduce:transition-none", open ? "top-1.5 rotate-45" : "top-0")} />
              <span className={cn("absolute left-0 top-1.5 block h-0.5 w-5 rounded-full bg-current transition-all duration-200 motion-reduce:transition-none", open ? "scale-x-0 opacity-0" : "opacity-100")} />
              <span className={cn("absolute left-0 block h-0.5 w-5 rounded-full bg-current transition-all duration-300 motion-reduce:transition-none", open ? "top-1.5 -rotate-45" : "top-3")} />
            </span>
          </button>
        </nav>

        {/* The small-screen menu panel */}
        <AnimatePresence>
          {open && (
            <motion.div
              id={panelId}
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -10, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.97 }}
              transition={reduceMotion ? { duration: 0.1 } : SPRING}
              style={{ transformOrigin: "top center" }}
              className="absolute inset-x-0 top-full mt-2 rounded-3xl border border-border bg-background/90 p-2 shadow-xl shadow-black/10 backdrop-blur-xl backdrop-saturate-150 md:hidden"
            >
              <NavLinks items={navItems} active={active} hovered={hovered} layoutId={`nav-pill-${mobileId}`} vertical reduceMotion={reduceMotion} onHover={setHovered} onSelect={handleSelect} />

              <div className="mt-2 border-t border-border p-1 pt-3">
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    onCtaClick();
                  }}
                  className={cn(ctaClasses, "h-12 w-full")}
                >
                  {ctaLabel}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </header>
  );
}

export default Component;
