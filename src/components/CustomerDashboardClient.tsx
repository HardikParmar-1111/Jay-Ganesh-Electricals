"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  ShoppingBag,
  Settings,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  Home,
  ArrowRight,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { MOCK_PRODUCTS } from "@/data/products";

const USER_TABS = [
  { id: "tracker", label: "My Quotes & Projects", icon: <FileText size={18} /> },
  { id: "wishlist", label: "Saved Supplies", icon: <ShoppingBag size={18} /> },
  { id: "profile", label: "Profile", icon: <Settings size={18} /> },
];

export interface CustomerLead {
  id: string;
  property_size: string;
  services_needed: string;
  quality_tier: string;
  status: "new" | "in_progress" | "completed";
  created_at: string;
}

export interface PortfolioProject {
  id: string;
  title: string;
  description: string;
  phase: string;
  created_at: string;
}

interface CustomerDashboardClientProps {
  user: {
    id: string;
    email?: string;
  };
  profile: {
    full_name?: string;
    phone?: string;
    role?: string;
  } | null;
  leads: CustomerLead[];
  projects: PortfolioProject[];
}

export function CustomerDashboardClient({
  user,
  profile,
  leads,
  projects,
}: CustomerDashboardClientProps) {
  const [activeTab, setActiveTab] = useState("tracker");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge variant="success">Completed</Badge>;
      case "in_progress":
        return <Badge variant="brand">In Progress</Badge>;
      case "new":
      default:
        return <Badge variant="neutral">Under Review</Badge>;
    }
  };

  return (
    <div className="min-h-full bg-zinc-50 dark:bg-zinc-950 pt-4 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-6 pb-4 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-4">
            <Logo size={48} />
            <div>
              <h1 className="text-2xl sm:text-3xl font-heading font-bold text-zinc-900 dark:text-white mb-0.5">
                My Account
              </h1>
              <p className="text-zinc-500 dark:text-zinc-400 text-xs sm:text-sm">
                Welcome back, {profile?.full_name || user.email?.split("@")[0] || "Customer"}
              </p>
            </div>
          </div>
          <Link href="/contracting">
            <Button className="gap-2">
              <Plus size={16} /> New Smart Quote
            </Button>
          </Link>
        </div>

        {/* Dynamic Tab Navigation (Apple iOS Segmented Style) */}
        <div className="flex overflow-x-auto hide-scrollbar gap-2 mb-6">
          {USER_TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                  isActive
                    ? "bg-zinc-900 text-white shadow-sm dark:bg-zinc-100 dark:text-zinc-900"
                    : "bg-white dark:bg-zinc-900 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800"
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            );
          })}
        </div>

        {/* TAB CONTENTS */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === "tracker" && (
              <div className="space-y-6">
                {/* Submitted Quotes Section */}
                <div>
                  <h3 className="text-lg sm:text-xl font-bold mb-3 text-zinc-900 dark:text-white flex items-center gap-2">
                    <Clock size={18} className="text-brand-gold" />
                    Submitted Smart Quotes ({leads.length})
                  </h3>

                  {leads.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {leads.map((lead) => (
                        <Card key={lead.id} className="p-5 space-y-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="text-xs text-zinc-400 font-mono">
                                Ref: {lead.id.slice(0, 8)}
                              </span>
                              <h4 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white mt-0.5">
                                {lead.property_size} Wiring Plan
                              </h4>
                            </div>
                            {getStatusBadge(lead.status)}
                          </div>

                          <div className="space-y-1.5 text-sm text-zinc-600 dark:text-zinc-300">
                            <div>
                              <span className="font-semibold text-xs uppercase tracking-wider text-zinc-400">
                                Tier:{" "}
                              </span>
                              <span>{lead.quality_tier} Quality</span>
                            </div>
                            <div>
                              <span className="font-semibold text-xs uppercase tracking-wider text-zinc-400">
                                Services:{" "}
                              </span>
                              <span>{lead.services_needed}</span>
                            </div>
                            <div className="text-xs text-zinc-400 pt-1">
                              Submitted on{" "}
                              {isMounted
                                ? new Date(lead.created_at).toLocaleDateString("en-IN", {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  })
                                : "Loading..."}
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <Card className="p-8 text-center border-dashed border-2 bg-transparent text-zinc-500">
                      <Home size={36} className="mx-auto mb-3 opacity-40" />
                      <h4 className="font-semibold text-base mb-1">No Active Quotes Yet</h4>
                      <p className="text-sm mb-4">
                        Use the Smart Quote Estimator to calculate and submit your home wiring project.
                      </p>
                      <Link href="/contracting">
                        <Button variant="secondary" size="sm">
                          Calculate Estimate
                        </Button>
                      </Link>
                    </Card>
                  )}
                </div>

                {/* Active Projects from portfolio_projects */}
                {projects.length > 0 && (
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold mb-3 text-zinc-900 dark:text-white flex items-center gap-2">
                      <CheckCircle2 size={18} className="text-emerald-500" />
                      Active Contracting Projects ({projects.length})
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {projects.map((proj) => (
                        <Card key={proj.id} className="p-5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-bold text-base sm:text-lg text-zinc-900 dark:text-white">{proj.title}</h4>
                            <Badge variant="brand">{proj.phase}</Badge>
                          </div>
                          <Link href="/tracker">
                            <Button variant="outline" size="sm" className="gap-1">
                              View Live Milestones <ArrowRight size={14} />
                            </Button>
                          </Link>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "wishlist" && (
              <div>
                <h3 className="text-xl font-bold mb-6">Saved Supplies</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {MOCK_PRODUCTS.slice(0, 3).map((product) => (
                    <Card key={product.id} className="p-4 flex flex-col">
                      <div className="aspect-square bg-slate-100 dark:bg-slate-800 rounded-xl mb-4 overflow-hidden">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h4 className="font-medium line-clamp-1">{product.name}</h4>
                      <p className="text-brand-gold font-bold mt-1">₹{product.price}</p>
                      <Button variant="secondary" size="sm" className="mt-4 w-full text-xs">
                        Remove
                      </Button>
                    </Card>
                  ))}
                  <Link href="/catalog" className="h-full">
                    <Card
                      interactive
                      className="h-full border-dashed border-2 border-slate-300 dark:border-slate-700 bg-transparent flex flex-col items-center justify-center text-slate-500 hover:text-brand-blue hover:border-brand-blue min-h-[250px]"
                    >
                      <ShoppingBag size={32} className="mb-2" />
                      <span className="font-medium">Browse Catalog</span>
                    </Card>
                  </Link>
                </div>
              </div>
            )}

            {activeTab === "profile" && (
              <Card className="p-6 md:p-8 max-w-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <h3 className="text-xl font-bold mb-6 text-zinc-900 dark:text-white">Personal Details</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">
                        Full Name
                      </label>
                      <div className="p-3 bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 text-sm">
                        {profile?.full_name || "Not specified"}
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">
                        Phone
                      </label>
                      <div className="p-3 bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 text-sm">
                        {profile?.phone || "Not specified"}
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">
                      Email Address
                    </label>
                    <div className="p-3 bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 text-sm">
                      {user.email}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">
                      Account Type
                    </label>
                    <div className="p-3 bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 text-sm font-medium text-brand-gold capitalize">
                      {profile?.role || "Customer"}
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
