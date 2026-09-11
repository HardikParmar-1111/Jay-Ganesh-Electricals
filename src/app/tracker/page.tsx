"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Clock, CircleDashed, User, Calendar } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

// Mock Project Data
const PROJECT = {
  id: "PRJ-2026-084",
  clientName: "Hardik Parmar",
  propertyName: "3BHK Alpine Residency",
  startDate: "2026-08-15",
  estCompletion: "2026-09-20",
  electrician: "Rajesh K.",
  status: "active", // active, completed, pending
};

const PHASES = [
  {
    id: 1,
    title: "Phase 1: Channelling & Wall Cutting",
    description: "Marking and cutting walls for conduit pipes as per the approved electrical drawing.",
    status: "completed",
    dateRange: "Aug 15 - Aug 20",
    progress: 100,
  },
  {
    id: 2,
    title: "Phase 2: Conduit & Wiring",
    description: "Laying PVC pipes, switch boxes, and pulling standard flame-retardant wires.",
    status: "in-progress",
    dateRange: "Aug 22 - Sep 05",
    progress: 65,
  },
  {
    id: 3,
    title: "Phase 3: Switch Plates & Finishing",
    description: "Installing modular plates, switches, MCB distribution board, and testing.",
    status: "upcoming",
    dateRange: "Sep 10 - Sep 18",
    progress: 0,
  },
];

export default function TrackerPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Mocked auth state

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-950">
        <Card variant="glass" className="p-8 text-center max-w-md w-full">
          <h2 className="text-2xl font-bold mb-4">Client Access Required</h2>
          <p className="text-slate-500 mb-6">Please log in to track your active projects.</p>
          <button 
            onClick={() => setIsLoggedIn(true)} 
            className="text-brand-blue font-medium hover:underline"
          >
            Mock Login
          </button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-8 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Project Header */}
        <div className="mb-10">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <h1 className="text-3xl font-heading font-bold text-slate-900 dark:text-white">
              Project Tracker
            </h1>
            <Badge variant="brand" className="text-sm px-3 py-1">Active</Badge>
          </div>
          
          <Card variant="glass" className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-slate-500 mb-1">Project ID</p>
                <p className="font-semibold text-slate-900 dark:text-white">{PROJECT.id}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-1">Property</p>
                <p className="font-semibold text-slate-900 dark:text-white">{PROJECT.propertyName}</p>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={18} className="text-slate-400" />
                <div>
                  <p className="text-sm text-slate-500 mb-1">Est. Completion</p>
                  <p className="font-semibold text-slate-900 dark:text-white">{PROJECT.estCompletion}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <User size={18} className="text-slate-400" />
                <div>
                  <p className="text-sm text-slate-500 mb-1">Lead Electrician</p>
                  <p className="font-semibold text-slate-900 dark:text-white">{PROJECT.electrician}</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Vertical Timeline */}
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-[27px] top-4 bottom-4 w-1 bg-slate-200 dark:bg-slate-800 rounded-full z-0" />
          
          <div className="space-y-12">
            {PHASES.map((phase, index) => {
              const isCompleted = phase.status === "completed";
              const isInProgress = phase.status === "in-progress";
              const isUpcoming = phase.status === "upcoming";

              return (
                <motion.div 
                  key={phase.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ delay: index * 0.2 }}
                  className="relative z-10 flex gap-6"
                >
                  {/* Status Icon */}
                  <div className="shrink-0 mt-1">
                    {isCompleted && (
                      <div className="w-14 h-14 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 ring-8 ring-slate-50 dark:ring-slate-950">
                        <CheckCircle2 size={28} />
                      </div>
                    )}
                    {isInProgress && (
                      <div className="w-14 h-14 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue ring-8 ring-slate-50 dark:ring-slate-950 relative">
                        <span className="absolute inset-0 rounded-full border-2 border-brand-blue animate-ping opacity-20" />
                        <Clock size={28} />
                      </div>
                    )}
                    {isUpcoming && (
                      <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 ring-8 ring-slate-50 dark:ring-slate-950">
                        <CircleDashed size={28} />
                      </div>
                    )}
                  </div>

                  {/* Phase Details */}
                  <div className="flex-1 pb-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <h3 className={`text-xl font-bold ${
                        isCompleted ? "text-slate-900 dark:text-white" : 
                        isInProgress ? "text-brand-blue" : "text-slate-500"
                      }`}>
                        {phase.title}
                      </h3>
                      <Badge variant={isCompleted ? "success" : isInProgress ? "brand" : "neutral"}>
                        {phase.dateRange}
                      </Badge>
                    </div>
                    
                    <p className="text-slate-600 dark:text-slate-400 mb-4">
                      {phase.description}
                    </p>

                    {/* Progress Bar */}
                    <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: `${phase.progress}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className={`h-full rounded-full ${
                          isCompleted ? "bg-green-500" : "bg-brand-blue"
                        }`}
                      />
                    </div>
                    <div className="mt-2 text-right text-xs font-semibold text-slate-500">
                      {phase.progress}%
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
