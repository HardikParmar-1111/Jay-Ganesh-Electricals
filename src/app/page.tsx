"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Zap, Wrench, Star } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, MotionCard } from "@/components/ui/Card";
import { ROOM_KITS } from "@/data/products";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-32 px-4 sm:px-6 lg:px-8">
        {/* Decorative background gradient orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-gold/10 rounded-full blur-3xl -z-10 mix-blend-multiply" />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-brand-blue/10 rounded-full blur-3xl -z-10 mix-blend-multiply" />

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left side: Retail Focus */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
              className="space-y-6"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-gold/10 text-brand-gold text-sm font-medium">
                <Zap size={16} /> Premium Electrical Supply
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
                Shop Premium Electricals
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400 max-w-md">
                From luxury switches to heavy-duty wires, discover top-tier products for your home and commercial projects.
              </p>
              <div className="pt-2">
                <Link href="/catalog">
                  <Button size="lg" className="gap-2 group">
                    Browse Catalog 
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* Right side: Contracting Focus */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1, type: "spring", bounce: 0.4 }}
              className="glass p-8 md:p-12 rounded-3xl relative overflow-hidden"
            >
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-brand-blue/10 rounded-full blur-2xl" />
              <div className="relative z-10 space-y-6">
                <div className="w-12 h-12 bg-brand-blue/10 rounded-2xl flex items-center justify-center text-brand-blue mb-4">
                  <Wrench size={24} />
                </div>
                <h2 className="text-3xl font-heading font-bold text-slate-900 dark:text-white">
                  Book Expert Wiring
                </h2>
                <p className="text-slate-600 dark:text-slate-400">
                  Get a precise, real-time estimate for your apartment or villa wiring. Professional execution guaranteed.
                </p>
                <Link href="/contracting" className="block pt-2">
                  <Button variant="secondary" size="lg" className="w-full gap-2 group">
                    Get Smart Quote
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Curated Electrical Bundles Section */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-heading font-bold text-slate-900 dark:text-white mb-2 tracking-tight">
                Curated Electrical Bundles
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                Complete wiring and switchgear kits for your space.
              </p>
            </div>
            <Link href="/catalog" className="hidden sm:inline-flex text-brand-blue font-medium hover:underline items-center gap-1 transition-colors">
              View All <ArrowRight size={16} />
            </Link>
          </div>

          <div className="flex overflow-x-auto pb-8 -mx-4 px-4 sm:mx-0 sm:px-0 gap-6 snap-x hide-scrollbar">
            {ROOM_KITS.map((kit, index) => (
              <MotionCard 
                key={kit.id}
                interactive
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="min-w-[280px] w-[280px] md:w-[320px] snap-center shrink-0 flex flex-col group rounded-2xl overflow-hidden border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="aspect-video w-full overflow-hidden relative">
                  {/* Fallback gradient if image fails */}
                  <div className="absolute inset-0 bg-slate-200 dark:bg-slate-800" />
                  <img 
                    src={kit.image} 
                    alt={kit.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 relative z-10"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 z-20 glass px-2.5 py-1 rounded-full text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-sm backdrop-blur-md">
                    {kit.itemCount} items
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-semibold text-lg text-slate-900 dark:text-white mb-1.5 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {kit.name}
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed mb-4 line-clamp-2">
                      {kit.description}
                    </p>
                  </div>
                  <div className="pt-3 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      Starts from
                    </span>
                    <span className="text-base font-bold text-slate-900 dark:text-white">
                      {kit.priceRange}
                    </span>
                  </div>
                </div>
              </MotionCard>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Stats Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-brand-gold/10 flex items-center justify-center text-brand-gold">
                <ShieldCheck size={32} />
              </div>
              <h3 className="text-3xl font-bold font-heading">100%</h3>
              <p className="text-slate-600 dark:text-slate-400 font-medium">Licensed & Insured</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue">
                <Star size={32} />
              </div>
              <h3 className="text-3xl font-bold font-heading">10+ Years</h3>
              <p className="text-slate-600 dark:text-slate-400 font-medium">Industry Experience</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center text-green-600">
                <Zap size={32} />
              </div>
              <h3 className="text-3xl font-bold font-heading">500+</h3>
              <p className="text-slate-600 dark:text-slate-400 font-medium">Projects Completed</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
