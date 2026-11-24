"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Zap,
  ArrowRight,
  Sliders,
  CheckCircle2,
  Sparkles,
  Cpu,
  Flame,
  Wind,
  SunMedium,
  Activity,
} from "lucide-react";
import { ArchitecturalHero } from "@/components/ArchitecturalHero";
import PendantLampRail from "@/components/ui/pendant-lamp-rail";
import { LAMP_DEMO_ITEMS } from "@/components/ui/pendant-lamp-rail-demo";

// 6 Core curated materials installed across Jay Ganesh contracting projects
const SHOWCASE_MATERIALS = [
  {
    id: "switches",
    title: "Modular Switches & Dimmers",
    subtitle: "Living, Dining & Master Suites",
    image: "/images/materials/switches.jpg",
    icon: <Sliders className="w-5 h-5 text-amber-400" />,
    specs: [
      "Flame-retardant virgin polycarbonate body",
      "Silver-inlay bimetal contact tips (spark-free)",
      "Tested for over 100,000 electrical clicks",
      "Smooth stepless capacitive fan dimming",
    ],
    highlight: "10-Year Replacement Guarantee",
  },
  {
    id: "lighting",
    title: "Architectural 3000K LED Lighting",
    subtitle: "Ceiling Coves, Downlights & Wall Washes",
    image: "/images/materials/lighting.jpg",
    icon: <SunMedium className="w-5 h-5 text-amber-400" />,
    specs: [
      "Deep recessed COB downlights with anti-glare baffle",
      "High CRI 90+ for accurate architectural color rendering",
      "Constant current isolated drivers with 4kV surge protection",
      "24V DC warm white 3000K linear perimeter cove strips",
    ],
    highlight: "Zero-Flicker Architectural Grade",
  },
  {
    id: "switchgear",
    title: "Distribution Panels & Switchgear",
    subtitle: "Main Panels, Sub-Panels & Safety Feeds",
    image: "/images/materials/distribution.jpg",
    icon: <Cpu className="w-5 h-5 text-blue-400" />,
    specs: [
      "B & C-Curve Miniature Circuit Breakers (MCB 10kA)",
      "30mA Residual Current Circuit Breakers (RCCB shock protection)",
      "Dedicated dual-pole isolators per floor distribution box",
      "Heavy-duty copper busbars with zinc-plated fasteners",
    ],
    highlight: "IS:8828 & IEC 60898 Compliant",
  },
  {
    id: "wires",
    title: "Heavy-Duty FR Copper Wiring",
    subtitle: "Concealed Conduits & Appliance Circuits",
    image: "/images/materials/wires.jpg",
    icon: <Flame className="w-5 h-5 text-amber-500" />,
    specs: [
      "99.97% pure electrolytic grade multi-strand copper",
      "Flame Retardant Low Smoke (FRLS) insulation",
      "High oxygen index (>30%) for superior fire resistance",
      "Strict color-coding (Phase, Neutral, Dedicated Earthing)",
    ],
    highlight: "IS:694 Certified Heavy Copper",
  },
  {
    id: "fans",
    title: "BLDC High-Efficiency Fans",
    subtitle: "Smart Airflow & Architectural Aesthetics",
    image: "/images/materials/fans.jpg",
    icon: <Wind className="w-5 h-5 text-emerald-400" />,
    specs: [
      "Brushless DC motor consuming only 28W at top speed",
      "Whisper-quiet double ball bearing construction",
      "RF wireless remote with timer and sleep modulation",
      "Rust-proof aerodynamic aluminum blades",
    ],
    highlight: "65% Energy Reduction",
  },
  {
    id: "facade",
    title: "Outdoor & Facade IP65 Luminaires",
    subtitle: "Pillars, Balconies & Garden Walkways",
    image: "/images/materials/facade.jpg",
    icon: <Sparkles className="w-5 h-5 text-amber-300" />,
    specs: [
      "Die-cast aluminum housing with anti-corrosion powder coat",
      "IP65 waterproof silicone gaskets against monsoon rain",
      "Dual-throw up/down optical lenses with 45° beam angle",
      "Low-voltage 12V pathway spike lights with honeycomb louver",
    ],
    highlight: "Weatherproof Architectural Accents",
  },
];

// Execution methodology steps
const CONTRACTING_STEPS = [
  {
    number: "01",
    title: "Site Survey & Load Audit",
    description:
      "On-site inspection to calculate connected electrical load, determine Phase distribution, and plan concealed conduit pathways.",
  },
  {
    number: "02",
    title: "Precision BOQ & Material Plan",
    description:
      "Detailed, transparent bill of quantities covering wire gauges, breaker ratings, switch module counts, and architectural luminaires.",
  },
  {
    number: "03",
    title: "Certified IS:732 Execution",
    description:
      "Concealed wall chasing, fire-retardant pipe installation, dedicated earthing pit execution, and clean board termination.",
  },
  {
    number: "04",
    title: "Megger & Load Testing",
    description:
      "Multi-point insulation resistance testing, RCCB earth-fault trip verification, and formal handover with electrical warranty.",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-transparent text-slate-900 dark:text-white selection:bg-amber-500 selection:text-zinc-950 transition-colors duration-300">
      {/* ================================================================= */}
      {/* 1. CINEMATIC FULL-FRAME ARCHITECTURAL HERO (SMOOTH TRANSITION)    */}
      {/* ================================================================= */}
      <ArchitecturalHero />

      {/* ================================================================= */}
      {/* 1.5 INTERACTIVE ARCHITECTURAL PENDANT LUMINAIRE TRACK (COMPACT)   */}
      {/* ================================================================= */}
      <section className="relative z-20 pt-8 pb-4 border-y border-slate-200/60 dark:border-zinc-800/60 bg-white/40 dark:bg-zinc-950/50 backdrop-blur-md transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2 pb-3 border-b border-slate-200/70 dark:border-zinc-900/80">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-amber-500 dark:bg-amber-400 animate-pulse" />
              <span className="text-xs uppercase tracking-widest text-amber-600 dark:text-amber-400 font-mono font-semibold">
                Architectural Fixture Track · Precision Luminaires
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-zinc-400 font-medium">
              Brush or click along the track to swing &amp; illuminate fixtures
            </p>
          </div>

          <PendantLampRail
            items={LAMP_DEMO_ITEMS}
            autoplay={true}
            interval={2600}
            className="bg-transparent"
          />
        </div>
      </section>

      {/* ================================================================= */}
      {/* 2. "WHAT WE INSTALL" - PREMIUM MATERIALS SHOWCASE (6 CORE ITEMS)  */}
      {/* ================================================================= */}
      <section id="materials" className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 border-t border-slate-200/60 dark:border-zinc-800/60 bg-transparent transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16 sm:mb-20"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-600 dark:text-amber-400 text-xs font-semibold tracking-wider uppercase mb-4">
              <ShieldCheck size={14} /> Certified Hardware &amp; Materials
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-heading tracking-tight text-slate-900 dark:text-white mb-4">
              What We Install
            </h2>
            <p className="text-slate-600 dark:text-zinc-400 text-sm sm:text-base leading-relaxed">
              We never compromise on safety or aesthetics. Every project wired by
              Jay Ganesh Electrical utilizes verified flame-retardant copper,
              precision switchgear, and architectural-grade luminaires.
            </p>
          </motion.div>

          {/* 6-Card Materials Grid (Clean, Premium, No Overlay Buttons) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {SHOWCASE_MATERIALS.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                whileHover={{ y: -6, transition: { duration: 0.25 } }}
                className="group relative rounded-3xl overflow-hidden bg-white/90 dark:bg-zinc-900/80 md:backdrop-blur-xl border border-slate-200/90 dark:border-zinc-800/70 hover:border-amber-500/40 shadow-md dark:shadow-xl hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-300 flex flex-col justify-between transform-gpu"
              >
                {/* Clean Item Photographic Showcase Banner */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100 dark:bg-zinc-800/60">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                  {/* Subtle dark vignette overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Card Body Details */}
                <div className="p-6 sm:p-7 pt-5 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Header with Title and Icon */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <h3 className="text-xl font-bold font-heading text-slate-900 dark:text-white mb-1 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-zinc-400 font-medium">
                          {item.subtitle}
                        </p>
                      </div>
                      <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center p-2 text-amber-500 dark:text-amber-400 shrink-0">
                        {item.icon}
                      </div>
                    </div>

                    {/* Technical Specifications */}
                    <ul className="space-y-2.5 mb-6">
                      {item.specs.map((spec, sIdx) => (
                        <li
                          key={sIdx}
                          className="flex items-start gap-2 text-xs text-slate-700 dark:text-zinc-300 leading-relaxed"
                        >
                          <CheckCircle2
                            size={14}
                            className="text-amber-500 dark:text-amber-400 shrink-0 mt-0.5"
                          />
                          <span>{spec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-4 border-t border-slate-100 dark:border-zinc-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-zinc-400 group-hover:text-slate-800 dark:group-hover:text-zinc-200 transition-colors">
                    <span className="font-semibold text-amber-600 dark:text-amber-400 tracking-wide">
                      {item.highlight}
                    </span>
                    <ShieldCheck size={14} className="text-amber-500 dark:text-amber-400/80" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* 3. "HOW WE WORK" - TURNKEY CONTRACTING PROCESS */}
      {/* ================================================================= */}
      <section className="py-28 px-4 sm:px-6 lg:px-8 border-t border-slate-200/60 dark:border-zinc-800/60 bg-transparent relative overflow-hidden transition-colors duration-300">
        {/* Ambient background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center text-center max-w-3xl mx-auto mb-20"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-semibold tracking-wider uppercase mb-4">
              <Activity size={14} /> Turnkey Execution Standards
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-heading tracking-tight text-slate-900 dark:text-white mb-4">
              Contracting Process
            </h2>
            <p className="text-slate-600 dark:text-zinc-400 text-sm sm:text-base leading-relaxed">
              From raw brickwork conduit chasing to certified final energization,
              our four-stage electrical workflow delivers total peace of mind.
            </p>
          </motion.div>

          {/* 4 Process Steps */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {CONTRACTING_STEPS.map((step, idx) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.12 }}
                whileHover={{ y: -6 }}
                className="relative rounded-3xl p-7 bg-white/80 dark:bg-zinc-900/40 border border-slate-200/90 dark:border-zinc-800/80 shadow-sm hover:border-amber-500/40 dark:hover:border-zinc-700/80 backdrop-blur-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="text-4xl font-black font-heading text-amber-500/40 mb-4 tracking-tighter">
                    {step.number}
                  </div>
                  <h3 className="text-lg font-bold font-heading text-slate-900 dark:text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* 4. TRUST & NUMBERS (100+ HOMES WIRED) */}
      {/* ================================================================= */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 border-t border-slate-200/60 dark:border-zinc-800/60 bg-transparent transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="p-8 rounded-3xl bg-white/80 dark:bg-zinc-900/50 border border-slate-200/90 dark:border-zinc-800/80 text-center flex flex-col items-center justify-center group hover:border-amber-500/30 shadow-sm dark:shadow-none backdrop-blur-xl transition-colors"
            >
              <div className="text-4xl sm:text-5xl font-black font-heading text-amber-500 dark:text-amber-400 mb-2">
                100+
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                Homes &amp; Villas Wired
              </h4>
              <p className="text-xs text-slate-500 dark:text-zinc-400">
                Residential &amp; duplex contracting
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="p-8 rounded-3xl bg-white/80 dark:bg-zinc-900/50 border border-slate-200/90 dark:border-zinc-800/80 text-center flex flex-col items-center justify-center group hover:border-blue-500/30 shadow-sm dark:shadow-none backdrop-blur-xl transition-colors"
            >
              <div className="text-4xl sm:text-5xl font-black font-heading text-blue-600 dark:text-blue-400 mb-2">
                10+
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                Years Experience
              </h4>
              <p className="text-xs text-slate-500 dark:text-zinc-400">
                Industry-tested master electricians
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="p-8 rounded-3xl bg-white/80 dark:bg-zinc-900/50 border border-slate-200/90 dark:border-zinc-800/80 text-center flex flex-col items-center justify-center group hover:border-emerald-500/30 shadow-sm dark:shadow-none backdrop-blur-xl transition-colors"
            >
              <div className="text-4xl sm:text-5xl font-black font-heading text-emerald-600 dark:text-emerald-400 mb-2">
                100%
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                IS:732 Certified
              </h4>
              <p className="text-xs text-slate-500 dark:text-zinc-400">
                Indian standard safety compliance
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="p-8 rounded-3xl bg-white/80 dark:bg-zinc-900/50 border border-slate-200/90 dark:border-zinc-800/80 text-center flex flex-col items-center justify-center group hover:border-amber-400/30 shadow-sm dark:shadow-none backdrop-blur-xl transition-colors"
            >
              <div className="text-4xl sm:text-5xl font-black font-heading text-slate-900 dark:text-white mb-2">
                0
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                Short-Cut Policy
              </h4>
              <p className="text-xs text-slate-500 dark:text-zinc-400">
                Dedicated neutral &amp; earth on all loops
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* 5. SINGLE BOLD CALL-TO-ACTION FOR CONTRACTING */}
      {/* ================================================================= */}
      <section className="py-28 px-4 sm:px-6 lg:px-8 border-t border-slate-200/60 dark:border-zinc-800/60 relative overflow-hidden bg-slate-950/40 dark:bg-zinc-950/50 backdrop-blur-xl text-white">
        <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/10 via-transparent to-blue-500/5 pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold tracking-wider uppercase mb-5">
              <Zap size={14} /> Instant Electrical Contracting BOQ
            </div>

            <h2 className="text-3xl sm:text-5xl md:text-6xl font-black font-heading tracking-tight text-white mb-6">
              Ready to Electrify Your Space?
            </h2>

            <p className="text-zinc-300 dark:text-zinc-400 text-sm sm:text-base max-w-2xl mb-10 leading-relaxed">
              Whether wiring a luxury multi-story villa, duplex, or commercial
              property, get an authentic, itemized contracting estimate in under
              two minutes.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <Link
                href="/contracting"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-amber-500 text-zinc-950 font-bold text-base hover:bg-amber-400 transition-all shadow-xl shadow-amber-500/20 active:scale-95 group"
              >
                <span>Calculate Contracting Estimate</span>
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>

              <Link
                href="/tracker"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-base border border-zinc-700 transition-all active:scale-95"
              >
                <span>Track Active Project</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
