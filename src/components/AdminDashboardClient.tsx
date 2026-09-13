"use client";

import React, { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart3,
  Inbox,
  Package,
  FileText,
  Users,
  HardHat,
  CheckCircle2,
  Clock,
  ChevronDown,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { updateLeadStatus, LeadStatus } from "@/app/admin/actions";
import { AddProductModal } from "./AddProductModal";

const ADMIN_TABS = [
  { id: "analytics", label: "Analytics", icon: <BarChart3 size={18} /> },
  { id: "leads", label: "Leads & Quotes", icon: <Inbox size={18} /> },
  { id: "inventory", label: "Inventory", icon: <Package size={18} /> },
  { id: "projects", label: "Projects", icon: <FileText size={18} /> },
  { id: "staff", label: "Staff", icon: <Users size={18} /> },
];

export interface AdminLead {
  id: string;
  property_size: string;
  services_needed: string;
  quality_tier: string;
  status: "new" | "in_progress" | "completed";
  created_at: string;
  item_id?: string | null;
  catalog_items?: {
    id: string;
    name: string;
    category?: string;
    image_url?: string;
    price?: number;
  } | null;
  profiles?: {
    full_name?: string;
    phone?: string;
  } | null;
}

export interface AdminCatalogItem {
  id: string;
  name: string;
  category: string;
  price: number;
  description?: string;
  image_url?: string;
  is_active?: boolean;
  created_at?: string;
}

interface AdminDashboardClientProps {
  metrics: {
    totalLeads: number;
    activeProjects: number;
    catalogCount: number;
  };
  initialLeads: AdminLead[];
  initialCatalogItems?: AdminCatalogItem[];
  adminEmail?: string;
}

export function AdminDashboardClient({
  metrics,
  initialLeads,
  initialCatalogItems = [],
  adminEmail,
}: AdminDashboardClientProps) {
  const [activeTab, setActiveTab] = useState("analytics");
  const [leadsList, setLeadsList] = useState<AdminLead[]>(initialLeads);
  const [productsList, setProductsList] = useState<AdminCatalogItem[]>(initialCatalogItems);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [updatingLeadId, setUpdatingLeadId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleProductAdded = (newProduct: AdminCatalogItem) => {
    setProductsList((prev) => [newProduct, ...prev]);
    setToastMessage(`"${newProduct.name}" added to inventory successfully!`);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleStatusChange = (leadId: string, newStatus: LeadStatus) => {
    setUpdatingLeadId(leadId);
    startTransition(async () => {
      const res = await updateLeadStatus(leadId, newStatus);
      if (res.success) {
        setLeadsList((prev) =>
          prev.map((lead) =>
            lead.id === leadId ? { ...lead, status: newStatus } : lead
          )
        );
      }
      setUpdatingLeadId(null);
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge variant="success">Completed</Badge>;
      case "in_progress":
        return <Badge variant="brand">In Progress</Badge>;
      case "new":
      default:
        return <Badge variant="neutral">New Inquiry</Badge>;
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
              <h1 className="text-2xl sm:text-3xl font-heading font-bold tracking-tight text-zinc-900 dark:text-white mb-0.5">
                Admin Control Center
              </h1>
              <p className="text-zinc-500 dark:text-zinc-400 text-xs sm:text-sm">
                Connected as {adminEmail || "Administrator"} • Live Database
              </p>
            </div>
          </div>
        </div>

        {/* Toast feedback banner */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-4 p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm flex items-center justify-between shadow-sm"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 size={18} className="shrink-0" />
                <span className="font-medium">{toastMessage}</span>
              </div>
              <button
                onClick={() => setToastMessage(null)}
                className="text-xs opacity-75 hover:opacity-100"
              >
                Dismiss
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dynamic Tab Navigation (Apple iOS Segmented Style) */}
        <div className="flex overflow-x-auto hide-scrollbar gap-2 mb-6">
          {ADMIN_TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 ease-in-out active:scale-95 whitespace-nowrap ${
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
            {/* ANALYTICS TAB */}
            {activeTab === "analytics" && (
              <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card className="p-5">
                    <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">
                      Total Inquiries & Leads
                    </h4>
                    <p className="text-3xl font-bold text-zinc-900 dark:text-white">
                      {metrics.totalLeads}
                    </p>
                    <Badge variant="success" className="mt-2">
                      Live from database
                    </Badge>
                  </Card>
                  <Card className="p-5">
                    <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">
                      Active Projects
                    </h4>
                    <p className="text-3xl font-bold text-zinc-900 dark:text-white">
                      {metrics.activeProjects}
                    </p>
                    <Badge variant="brand" className="mt-2">
                      Contracting Active
                    </Badge>
                  </Card>
                  <Card className="p-5">
                    <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">
                      Active Catalog Items
                    </h4>
                    <p className="text-3xl font-bold text-zinc-900 dark:text-white">
                      {metrics.catalogCount}
                    </p>
                    <span className="text-xs text-zinc-400 block mt-2">Public catalog</span>
                  </Card>
                  <Card className="p-5">
                    <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">
                      Pending Follow-up
                    </h4>
                    <p className="text-3xl font-bold text-amber-500">
                      {leadsList.filter((l) => l.status === "new").length}
                    </p>
                    <Badge variant="neutral" className="mt-2">
                      Requires inspection
                    </Badge>
                  </Card>
                </div>

                {/* Quick Leads Snapshot */}
                <div className="mt-6">
                  <h3 className="text-lg sm:text-xl font-bold mb-3 text-zinc-900 dark:text-white">Latest Inquiries Overview</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {leadsList.slice(0, 3).map((lead) => (
                      <Card key={lead.id} className="p-5 space-y-2">
                        <div className="flex justify-between items-start">
                          <span className="font-semibold text-base text-zinc-900 dark:text-white truncate max-w-[180px]">
                            {lead.catalog_items?.name || lead.property_size}
                          </span>
                          {getStatusBadge(lead.status)}
                        </div>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">
                          Client: {lead.profiles?.full_name || "New Client"} •{" "}
                          {lead.profiles?.phone || "No phone"}
                        </p>
                        <p className="text-xs text-zinc-400 truncate">
                          {lead.catalog_items ? `Qty: ${lead.property_size} • ${lead.services_needed}` : `Tier: ${lead.quality_tier} | ${lead.services_needed}`}
                        </p>
                      </Card>
                    ))}
                    {leadsList.length === 0 && (
                      <Card className="p-6 col-span-3 text-center text-zinc-500 border-dashed border-2 bg-transparent">
                        No customer inquiries received yet.
                      </Card>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* LEADS & QUOTES TAB */}
            {activeTab === "leads" && (
              <Card className="overflow-hidden bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <div className="p-5 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center bg-zinc-50/60 dark:bg-zinc-900/60">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white">
                      Customer Leads & Estimates
                    </h3>
                    <p className="text-xs text-zinc-500">
                      Real-time submissions from the Smart Quote Estimator
                    </p>
                  </div>
                  <Badge variant="brand">{leadsList.length} Total Leads</Badge>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
                      <tr>
                        <th className="px-6 py-3.5 font-semibold text-zinc-600 dark:text-zinc-400 text-xs uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3.5 font-semibold text-zinc-600 dark:text-zinc-400 text-xs uppercase tracking-wider">
                          Client / Contact
                        </th>
                        <th className="px-6 py-3.5 font-semibold text-zinc-600 dark:text-zinc-400 text-xs uppercase tracking-wider">
                          Requested Item / Services
                        </th>
                        <th className="px-6 py-3.5 font-semibold text-zinc-600 dark:text-zinc-400 text-xs uppercase tracking-wider">
                          Scope / Quantity
                        </th>
                        <th className="px-6 py-3.5 font-semibold text-zinc-600 dark:text-zinc-400 text-xs uppercase tracking-wider">
                          Current Status
                        </th>
                        <th className="px-6 py-3.5 font-semibold text-zinc-600 dark:text-zinc-400 text-xs uppercase tracking-wider">
                          Update Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 bg-white dark:bg-zinc-900">
                      {leadsList.map((lead) => {
                        const isUpdating = updatingLeadId === lead.id && isPending;

                        return (
                          <tr
                            key={lead.id}
                            className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                          >
                            <td className="px-6 py-4 text-xs text-slate-500">
                              {new Date(lead.created_at).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </td>
                            <td className="px-6 py-4">
                              <div className="font-semibold text-slate-900 dark:text-white">
                                {lead.profiles?.full_name || "Registered User"}
                              </div>
                              <div className="text-xs text-slate-400">
                                {lead.profiles?.phone || "Phone on profile"}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              {lead.catalog_items ? (
                                <div className="flex items-center gap-2.5">
                                  {lead.catalog_items.image_url && (
                                    <img
                                      src={lead.catalog_items.image_url}
                                      alt={lead.catalog_items.name}
                                      className="w-9 h-9 rounded-lg object-contain bg-zinc-100 dark:bg-zinc-800 p-1 flex-shrink-0 border border-zinc-200 dark:border-zinc-700"
                                    />
                                  )}
                                  <div className="min-w-0">
                                    <div className="font-semibold text-zinc-900 dark:text-white truncate max-w-[220px]">
                                      {lead.catalog_items.name}
                                    </div>
                                    <div className="text-xs text-brand-gold font-medium truncate max-w-[220px]">
                                      {lead.services_needed || lead.catalog_items.category || "Catalog Item"}
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <div className="max-w-xs">
                                  <div className="font-medium text-zinc-900 dark:text-white truncate">
                                    {lead.services_needed}
                                  </div>
                                  <div className="text-xs text-zinc-400 truncate">
                                    Tier: {lead.quality_tier}
                                  </div>
                                </div>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              <span className="font-medium text-slate-900 dark:text-white">
                                {lead.property_size || "10 units"}
                              </span>
                              {lead.quality_tier && (
                                <span className="text-xs text-slate-500 block truncate max-w-[180px]">
                                  {lead.quality_tier}
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4">{getStatusBadge(lead.status)}</td>
                            <td className="px-6 py-4">
                              <div className="inline-flex items-center gap-1.5 bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl border border-zinc-200/60 dark:border-zinc-700/60">
                                {isUpdating ? (
                                  <div className="px-3 py-1 flex items-center gap-1.5 text-xs text-zinc-400">
                                    <Loader2 size={13} className="animate-spin" /> Saving...
                                  </div>
                                ) : (
                                  <>
                                    <button
                                      type="button"
                                      onClick={() => handleStatusChange(lead.id, "new")}
                                      className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all ${
                                        lead.status === "new"
                                          ? "bg-white dark:bg-zinc-700 shadow-sm text-zinc-900 dark:text-white"
                                          : "text-zinc-500 hover:text-zinc-800"
                                      }`}
                                    >
                                      New
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleStatusChange(lead.id, "in_progress")}
                                      className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all ${
                                        lead.status === "in_progress"
                                          ? "bg-brand-blue text-white shadow-sm"
                                          : "text-zinc-500 hover:text-zinc-800"
                                      }`}
                                    >
                                      In Progress
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleStatusChange(lead.id, "completed")}
                                      className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all ${
                                        lead.status === "completed"
                                          ? "bg-emerald-600 text-white shadow-sm"
                                          : "text-zinc-500 hover:text-zinc-800"
                                      }`}
                                    >
                                      Completed
                                    </button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                      {leadsList.length === 0 && (
                        <tr>
                          <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                            No inquiries found in customer_leads table.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}

            {/* INVENTORY TAB */}
            {activeTab === "inventory" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-heading font-bold tracking-tight text-zinc-900 dark:text-white">Catalog Management</h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      {productsList.length} items in live inventory
                    </p>
                  </div>
                  <Button
                    onClick={() => setIsAddProductModalOpen(true)}
                    className="gap-2 shadow-sm"
                  >
                    <Package size={16} /> Add Product
                  </Button>
                </div>

                {productsList.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {productsList.map((p) => (
                      <Card
                        key={p.id}
                        className="p-3 flex flex-col bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 ease-in-out"
                      >
                        <div className="aspect-square bg-zinc-100 dark:bg-zinc-800/70 rounded-xl mb-2.5 overflow-hidden border border-zinc-100 dark:border-zinc-800 flex items-center justify-center">
                          {p.image_url ? (
                            <img
                              src={p.image_url}
                              className="w-full h-full object-cover"
                              alt={p.name}
                            />
                          ) : (
                            <Package size={28} className="text-zinc-300 dark:text-zinc-600" />
                          )}
                        </div>
                        <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider line-clamp-1 mb-0.5">
                          {p.category}
                        </span>
                        <p className="font-medium text-sm text-zinc-900 dark:text-white line-clamp-1 mb-2">
                          {p.name}
                        </p>
                        <div className="flex justify-between items-center mt-auto pt-2 border-t border-zinc-100 dark:border-zinc-800 text-xs">
                          <span className="font-bold text-brand-gold font-mono">
                            ₹{Number(p.price).toLocaleString("en-IN")}
                          </span>
                          <span
                            className={`text-[11px] font-medium ${
                              p.is_active !== false
                                ? "text-emerald-600 dark:text-emerald-400"
                                : "text-zinc-400"
                            }`}
                          >
                            {p.is_active !== false ? "In Stock" : "Out of Stock"}
                          </span>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className="p-12 text-center border-dashed border-2 bg-transparent text-zinc-500">
                    <Package size={40} className="mx-auto mb-3 opacity-40 text-brand-gold" />
                    <h4 className="font-semibold text-base text-zinc-900 dark:text-white mb-1">
                      No Catalog Items Found
                    </h4>
                    <p className="text-sm mb-4">
                      Click &quot;Add Product&quot; above to insert your first electrical hardware item into the catalog.
                    </p>
                    <Button onClick={() => setIsAddProductModalOpen(true)} className="gap-2">
                      <Package size={16} /> Add First Product
                    </Button>
                  </Card>
                )}
              </div>
            )}

            {/* PROJECTS & STAFF TAB */}
            {(activeTab === "projects" || activeTab === "staff") && (
              <Card className="p-12 flex flex-col items-center justify-center text-center border-dashed border-2 bg-transparent text-slate-500">
                <HardHat size={48} className="mb-4 opacity-50" />
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                  Module Under Active Supervision
                </h3>
                <p>The {activeTab} management panel is linked to active contracting workflows.</p>
              </Card>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Add Product Modal */}
        <AddProductModal
          isOpen={isAddProductModalOpen}
          onClose={() => setIsAddProductModalOpen(false)}
          onSuccess={handleProductAdded}
        />
      </div>
    </div>
  );
}
