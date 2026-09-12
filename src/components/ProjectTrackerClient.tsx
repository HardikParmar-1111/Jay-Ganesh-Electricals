"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  Clock,
  CircleDashed,
  Calendar,
  Layers,
  Zap,
  ArrowRight,
  RefreshCw,
  Plus,
  ShieldCheck,
  Building,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/utils/supabase/client";

export interface CustomerLead {
  id: string;
  property_size: string;
  services_needed: string;
  quality_tier: string;
  status: "new" | "in_progress" | "completed";
  created_at: string;
}

interface ProjectTrackerClientProps {
  user: {
    id: string;
    email?: string;
  };
  profile: {
    full_name?: string;
    phone?: string;
  } | null;
  leads: CustomerLead[];
}

export function ProjectTrackerClient({
  user,
  profile,
  leads,
}: ProjectTrackerClientProps) {
  const router = useRouter();
  const [selectedLeadId, setSelectedLeadId] = useState<string>(
    leads.length > 0 ? leads[0].id : ""
  );
  const [isMounted, setIsMounted] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Safe client-side hydration for dates
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Update selected lead if leads change
  useEffect(() => {
    if (leads.length > 0 && !leads.some((l) => l.id === selectedLeadId)) {
      setSelectedLeadId(leads[0].id);
    }
  }, [leads, selectedLeadId]);

  // Supabase Real-Time Listener for automatic live updates when Admin changes status
  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel("customer_leads_tracker_live")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "customer_leads",
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          router.refresh();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user.id, router]);

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    router.refresh();
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  const selectedLead =
    leads.find((lead) => lead.id === selectedLeadId) || leads[0];

  // Map database status ('new', 'in_progress', 'completed') to stepper phases
  const getTimelinePhases = (status: "new" | "in_progress" | "completed", createdAt: string) => {
    const formattedDate = isMounted
      ? new Date(createdAt).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "Initiated";

    return [
      {
        id: 1,
        title: "Phase 1: Quote Review & Technical Estimation",
        description:
          "Initial project scoping, load calculations, and technical review by our master technicians.",
        status:
          status === "new"
            ? ("in-progress" as const)
            : ("completed" as const),
        badgeText:
          status === "new"
            ? "Under Review"
            : `Approved (${formattedDate})`,
        progress: status === "new" ? 60 : 100,
      },
      {
        id: 2,
        title: "Phase 2: Conduit, Wiring & Installation",
        description:
          "Wall channeling, laying heavy-duty PVC conduits, pulling ISI flame-retardant wiring, and installing modular boxes.",
        status:
          status === "completed"
            ? ("completed" as const)
            : status === "in_progress"
            ? ("in-progress" as const)
            : ("upcoming" as const),
        badgeText:
          status === "completed"
            ? "Wiring Completed"
            : status === "in_progress"
            ? "Active On-Site"
            : "Queued",
        progress:
          status === "completed"
            ? 100
            : status === "in_progress"
            ? 65
            : 0,
      },
      {
        id: 3,
        title: "Phase 3: Switchgear, Testing & Project Handover",
        description:
          "Distribution board assembly, MCB/RCCB safety verification, insulation resistance testing, and final sign-off.",
        status:
          status === "completed"
            ? ("completed" as const)
            : ("upcoming" as const),
        badgeText:
          status === "completed" ? "Site Handover Done" : "Upcoming",
        progress: status === "completed" ? 100 : 0,
      },
    ];
  };

  const getOverallProgress = (status: "new" | "in_progress" | "completed") => {
    switch (status) {
      case "completed":
        return 100;
      case "in_progress":
        return 65;
      case "new":
      default:
        return 25;
    }
  };

  const getStatusBadge = (status: "new" | "in_progress" | "completed") => {
    switch (status) {
      case "completed":
        return <Badge variant="success">Job Completed</Badge>;
      case "in_progress":
        return <Badge variant="brand">Wiring In Progress</Badge>;
      case "new":
      default:
        return <Badge variant="neutral">Under Review</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pt-6 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl sm:text-3xl font-heading font-bold tracking-tight text-zinc-900 dark:text-white">
                Project Tracker
              </h1>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Sync
              </span>
            </div>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Real-time progress for your electrical contracting jobs & wiring projects.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleManualRefresh}
              disabled={isRefreshing}
              className="gap-1.5"
            >
              <RefreshCw
                size={14}
                className={isRefreshing ? "animate-spin text-brand-gold" : ""}
              />
              <span>Refresh</span>
            </Button>
            <Link href="/contracting">
              <Button size="sm" className="gap-1.5">
                <Plus size={14} />
                <span>New Estimate</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Empty State if user has no leads */}
        {leads.length === 0 ? (
          <Card className="p-10 text-center border-dashed border-2 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm max-w-lg mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-brand-gold/10 text-brand-gold flex items-center justify-center mx-auto mb-4">
              <Building size={28} />
            </div>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
              No Active Projects Found
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6 leading-relaxed">
              You do not have any electrical estimates or projects under your account yet. Use our Smart Quote estimator to configure your home wiring and track its progress live right here.
            </p>
            <Link href="/contracting">
              <Button className="gap-2">
                Create a Smart Quote <ArrowRight size={16} />
              </Button>
            </Link>
          </Card>
        ) : (
          <>
            {/* Multi-Project Selector (if user has multiple leads) */}
            {leads.length > 1 && (
              <div className="mb-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                  Select Project ({leads.length})
                </p>
                <div className="flex flex-wrap gap-2">
                  {leads.map((lead) => {
                    const isSelected = lead.id === selectedLead.id;
                    return (
                      <button
                        key={lead.id}
                        onClick={() => setSelectedLeadId(lead.id)}
                        className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-medium transition-all flex items-center gap-2 border ${
                          isSelected
                            ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 border-zinc-900 dark:border-zinc-100 shadow-sm"
                            : "bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"
                        }`}
                      >
                        <span>{lead.property_size}</span>
                        <span className="text-[10px] opacity-75 font-mono">
                          #{lead.id.slice(0, 6)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Selected Lead Overview Card */}
            <div className="mb-8">
              <Card className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all duration-300 ease-in-out">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 mb-5 border-b border-zinc-100 dark:border-zinc-800">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono text-zinc-400">
                        REF: #{selectedLead.id.slice(0, 8).toUpperCase()}
                      </span>
                      {getStatusBadge(selectedLead.status)}
                    </div>
                    <h2 className="text-xl sm:text-2xl font-heading font-bold tracking-tight text-zinc-900 dark:text-white">
                      {selectedLead.property_size} Electrical Work
                    </h2>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-zinc-500">
                    <Calendar size={14} className="text-zinc-400" />
                    <span>
                      Initiated:{" "}
                      {isMounted
                        ? new Date(selectedLead.created_at).toLocaleDateString(
                            "en-IN",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            }
                          )
                        : "..."}
                    </span>
                  </div>
                </div>

                {/* Grid of specs */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800">
                    <p className="text-xs text-zinc-400 uppercase tracking-wider font-semibold mb-1 flex items-center gap-1.5">
                      <Layers size={13} className="text-brand-gold" /> Quality Tier
                    </p>
                    <p className="text-sm font-semibold text-zinc-900 dark:text-white capitalize">
                      {selectedLead.quality_tier} Grade
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 sm:col-span-2">
                    <p className="text-xs text-zinc-400 uppercase tracking-wider font-semibold mb-1 flex items-center gap-1.5">
                      <Zap size={13} className="text-brand-gold" /> Services Requested
                    </p>
                    <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200 line-clamp-2">
                      {selectedLead.services_needed}
                    </p>
                  </div>
                </div>

                {/* Overall Completion Bar */}
                <div>
                  <div className="flex justify-between items-center text-xs font-semibold mb-1.5">
                    <span className="text-zinc-500">Overall Milestone Progress</span>
                    <span className="text-brand-gold font-mono">
                      {getOverallProgress(selectedLead.status)}%
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: `${getOverallProgress(selectedLead.status)}%`,
                      }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      className={`h-full rounded-full ${
                        selectedLead.status === "completed"
                          ? "bg-emerald-500"
                          : "bg-brand-gold"
                      }`}
                    />
                  </div>
                </div>
              </Card>
            </div>

            {/* Vertical Stepper / Milestones */}
            <div className="relative pl-2 sm:pl-4">
              {/* Vertical connecting line */}
              <div className="absolute left-[31px] sm:left-[39px] top-6 bottom-6 w-1 bg-zinc-200 dark:bg-zinc-800 rounded-full z-0" />

              <div className="space-y-10">
                {getTimelinePhases(
                  selectedLead.status,
                  selectedLead.created_at
                ).map((phase, index) => {
                  const isCompleted = phase.status === "completed";
                  const isInProgress = phase.status === "in-progress";
                  const isUpcoming = phase.status === "upcoming";

                  return (
                    <motion.div
                      key={phase.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.15 }}
                      className="relative z-10 flex gap-4 sm:gap-6 items-start"
                    >
                      {/* Step Indicator Bubble */}
                      <div className="shrink-0 mt-0.5">
                        {isCompleted && (
                          <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-500 flex items-center justify-center text-emerald-600 dark:text-emerald-400 ring-4 ring-zinc-50 dark:ring-zinc-950 shadow-sm">
                            <CheckCircle2 size={22} />
                          </div>
                        )}
                        {isInProgress && (
                          <div className="w-12 h-12 rounded-full bg-brand-blue/10 dark:bg-brand-blue/20 border-2 border-brand-blue flex items-center justify-center text-brand-blue ring-4 ring-zinc-50 dark:ring-zinc-950 relative shadow-sm">
                            <span className="absolute inset-0 rounded-full border-2 border-brand-blue animate-ping opacity-30" />
                            <Clock size={22} />
                          </div>
                        )}
                        {isUpcoming && (
                          <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 border-2 border-zinc-300 dark:border-zinc-700 flex items-center justify-center text-zinc-400 ring-4 ring-zinc-50 dark:ring-zinc-950">
                            <CircleDashed size={22} />
                          </div>
                        )}
                      </div>

                      {/* Phase Content Box */}
                      <div className="flex-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 ease-in-out">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                          <h3
                            className={`text-base sm:text-lg font-heading font-bold tracking-tight ${
                              isCompleted
                                ? "text-zinc-900 dark:text-white"
                                : isInProgress
                                ? "text-brand-blue dark:text-blue-400"
                                : "text-zinc-400 dark:text-zinc-500"
                            }`}
                          >
                            {phase.title}
                          </h3>
                          <Badge
                            variant={
                              isCompleted
                                ? "success"
                                : isInProgress
                                ? "brand"
                                : "neutral"
                            }
                          >
                            {phase.badgeText}
                          </Badge>
                        </div>

                        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4 leading-relaxed">
                          {phase.description}
                        </p>

                        {/* Phase Progress Bar */}
                        <div className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${phase.progress}%` }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className={`h-full rounded-full ${
                              isCompleted
                                ? "bg-emerald-500"
                                : isInProgress
                                ? "bg-brand-blue"
                                : "bg-transparent"
                            }`}
                          />
                        </div>
                        <div className="mt-1.5 text-right text-[11px] font-mono text-zinc-400">
                          {phase.progress}% Done
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
