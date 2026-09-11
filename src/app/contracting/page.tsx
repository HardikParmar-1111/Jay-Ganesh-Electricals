"use client";

import React, { useState, useMemo, useTransition } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Zap,
  ShieldCheck,
  ArrowRight,
  MessageCircle,
  CheckCircle2,
  Loader2,
  FileCheck2,
  X,
} from "lucide-react";
import { StepIndicator } from "@/components/ui/StepIndicator";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { AuthModal } from "@/components/AuthModal";
import { submitQuote } from "@/app/contracting/actions";

// Pricing calculation models
const PROPERTY_SIZES = [
  { id: "1bhk", label: "1 BHK", baseRate: 15000, icon: <Home size={24} /> },
  { id: "2bhk", label: "2 BHK", baseRate: 25000, icon: <Home size={24} /> },
  { id: "3bhk", label: "3 BHK", baseRate: 35000, icon: <Home size={24} /> },
  { id: "villa", label: "Villa / Bungalow", baseRate: 55000, icon: <Home size={24} /> },
];

const SERVICES = [
  { id: "full_wiring", label: "Full House Wiring", addedCost: 0 },
  { id: "panel_upgrade", label: "Main Panel Upgrade", addedCost: 12000 },
  { id: "ac_points", label: "Dedicated AC Points", addedCost: 3500 },
  { id: "geyser_points", label: "Geyser Installation", addedCost: 2000 },
  { id: "smart_home", label: "Smart Home Automation", addedCost: 45000 },
];

const MATERIAL_QUALITY = [
  { id: "standard", label: "Standard", multiplier: 1, desc: "Reliable, ISI marked materials." },
  { id: "premium", label: "Premium", multiplier: 1.4, desc: "Top brands, modular aesthetic." },
  { id: "luxury", label: "Luxury", multiplier: 2.2, desc: "Glass plates, imported switches." },
];

export default function SmartQuotePage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedSize, setSelectedSize] = useState(PROPERTY_SIZES[1].id);
  const [selectedServices, setSelectedServices] = useState<string[]>(["full_wiring"]);
  const [selectedQuality, setSelectedQuality] = useState(MATERIAL_QUALITY[1].id);

  // Submission & Modal states
  const [isSubmitting, startTransition] = useTransition();
  const [submissionSuccess, setSubmissionSuccess] = useState<boolean>(false);
  const [createdLeadId, setCreatedLeadId] = useState<string | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const steps = ["Property", "Services", "Materials", "Estimate"];

  const handleServiceToggle = (id: string) => {
    setSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const selectedSizeObj =
    PROPERTY_SIZES.find((s) => s.id === selectedSize) || PROPERTY_SIZES[0];
  const selectedQualityObj =
    MATERIAL_QUALITY.find((q) => q.id === selectedQuality) || MATERIAL_QUALITY[0];
  const selectedServiceLabels = selectedServices.map(
    (id) => SERVICES.find((s) => s.id === id)?.label || id
  );

  const calculateEstimate = useMemo(() => {
    const servicesCost = selectedServices.reduce((total, sId) => {
      const s = SERVICES.find((srv) => srv.id === sId);
      return total + (s ? s.addedCost : 0);
    }, 0);

    const baseCost = selectedSizeObj.baseRate + servicesCost;
    const finalCost = baseCost * selectedQualityObj.multiplier;

    const min = Math.round((finalCost * 0.85) / 1000) * 1000;
    const max = Math.round((finalCost * 1.15) / 1000) * 1000;

    return { min, max };
  }, [selectedSizeObj, selectedQualityObj, selectedServices]);

  const handleSubmitQuote = () => {
    setErrorMessage(null);
    startTransition(async () => {
      const res = await submitQuote({
        propertySize: selectedSizeObj.label,
        servicesNeeded: selectedServiceLabels,
        qualityTier: selectedQualityObj.label,
      });

      if (res.requiresAuth) {
        setIsAuthOpen(true);
        setErrorMessage(res.error || "Please sign in to proceed.");
      } else if (res.error) {
        setErrorMessage(res.error);
      } else if (res.success) {
        setCreatedLeadId(res.leadId || null);
        setSubmissionSuccess(true);
      }
    });
  };

  const generateWhatsAppLink = () => {
    const text = `Hi Jay Ganesh Electrical,\n\nI used your Smart Quote Estimator:\n*Property*: ${selectedSizeObj.label}\n*Services*: ${selectedServiceLabels.join(", ")}\n*Quality*: ${selectedQualityObj.label}\n*Estimate*: ₹${calculateEstimate.min.toLocaleString()} - ₹${calculateEstimate.max.toLocaleString()}\n\nPlease contact me for consultation.`;
    return `https://wa.me/919876543210?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-8 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-blue/10 text-brand-blue mb-4">
            <Zap size={32} />
          </div>
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-slate-900 dark:text-white mb-4">
            Smart Quote Estimator
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            Get an instant, customized estimate for your apartment or home wiring in just a few clicks.
          </p>
        </div>

        <div className="mb-12">
          <StepIndicator steps={steps} currentStep={currentStep} />
        </div>

        <div className="relative">
          <AnimatePresence mode="wait">
            {/* STEP 1: Property Size */}
            {currentStep === 0 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6 min-h-[300px]"
              >
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  1. Select Property Configuration
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {PROPERTY_SIZES.map((size) => (
                    <Card
                      key={size.id}
                      interactive
                      selected={selectedSize === size.id}
                      onClick={() => setSelectedSize(size.id)}
                      className="p-6 flex items-center gap-4 cursor-pointer"
                    >
                      <div className="p-3 bg-brand-blue/10 rounded-2xl text-brand-blue">
                        {size.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{size.label}</h3>
                        <p className="text-slate-500 text-sm">
                          Estimated base: ₹{size.baseRate.toLocaleString()}
                        </p>
                      </div>
                    </Card>
                  ))}
                </div>
              </motion.div>
            )}

            {/* STEP 2: Services */}
            {currentStep === 1 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6 min-h-[300px]"
              >
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  2. Select Required Services
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {SERVICES.map((srv) => (
                    <Card
                      key={srv.id}
                      interactive
                      selected={selectedServices.includes(srv.id)}
                      onClick={() => handleServiceToggle(srv.id)}
                      className="p-6 flex items-center justify-between cursor-pointer"
                    >
                      <div>
                        <h3 className="font-semibold text-lg">{srv.label}</h3>
                        <p className="text-slate-500 text-sm">
                          {srv.addedCost === 0 ? "Included in base" : `+ ₹${srv.addedCost.toLocaleString()}`}
                        </p>
                      </div>
                      <div
                        className={`w-6 h-6 rounded-full border flex items-center justify-center transition-colors ${
                          selectedServices.includes(srv.id)
                            ? "bg-brand-blue border-brand-blue text-white"
                            : "border-slate-300"
                        }`}
                      >
                        {selectedServices.includes(srv.id) && <ShieldCheck size={14} />}
                      </div>
                    </Card>
                  ))}
                </div>
              </motion.div>
            )}

            {/* STEP 3: Quality */}
            {currentStep === 2 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6 min-h-[300px]"
              >
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  3. Select Material & Hardware Tier
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {MATERIAL_QUALITY.map((quality) => (
                    <Card
                      key={quality.id}
                      interactive
                      selected={selectedQuality === quality.id}
                      onClick={() => setSelectedQuality(quality.id)}
                      className="p-6 cursor-pointer flex flex-col justify-between"
                    >
                      <h3 className="font-bold text-xl mb-2">{quality.label}</h3>
                      <p className="text-slate-500 text-sm">{quality.desc}</p>
                    </Card>
                  ))}
                </div>
              </motion.div>
            )}

            {/* STEP 4: Estimate */}
            {currentStep === 3 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, type: "spring", bounce: 0.4 }}
                className="flex flex-col items-center justify-center min-h-[300px]"
              >
                <Card
                  variant="glass"
                  className="w-full max-w-2xl p-8 md:p-12 text-center relative overflow-hidden shadow-2xl"
                >
                  <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold/10 rounded-full blur-3xl -z-10" />
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-blue/10 rounded-full blur-3xl -z-10" />

                  {errorMessage && (
                    <div className="mb-6 p-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600 text-sm">
                      {errorMessage}
                    </div>
                  )}

                  <h2 className="text-2xl font-medium text-slate-600 dark:text-slate-400 mb-4">
                    Your Estimated Project Range
                  </h2>

                  <div className="text-5xl md:text-6xl font-heading font-bold text-slate-900 dark:text-white mb-6 tracking-tight">
                    ₹{calculateEstimate.min.toLocaleString()}{" "}
                    <span className="text-3xl text-slate-400 font-normal">to</span>{" "}
                    ₹{calculateEstimate.max.toLocaleString()}
                  </div>

                  <div className="flex flex-wrap justify-center gap-2 mb-8 text-xs text-slate-500">
                    <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800">
                      Property: {selectedSizeObj.label}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800">
                      Tier: {selectedQualityObj.label}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800">
                      {selectedServices.length} Services Selected
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Button
                      size="lg"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90 shadow-lg transition-all active:scale-95"
                      onClick={handleSubmitQuote}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 size={18} className="animate-spin" />
                          <span>Submitting...</span>
                        </>
                      ) : (
                        <>
                          <FileCheck2 size={18} />
                          <span>Submit Quote Request</span>
                        </>
                      )}
                    </Button>

                    <Button
                      size="lg"
                      className="w-full sm:w-auto gap-2 bg-[#25D366] text-white hover:bg-[#128C7E] shadow-lg shadow-[#25D366]/20 transition-all active:scale-95"
                      onClick={() => window.open(generateWhatsAppLink(), "_blank")}
                    >
                      <MessageCircle size={18} /> Send to WhatsApp
                    </Button>

                    <Button
                      variant="ghost"
                      size="lg"
                      className="w-full sm:w-auto transition-all active:scale-95"
                      onClick={() => setCurrentStep(0)}
                    >
                      Recalculate
                    </Button>
                  </div>

                  <p className="text-xs text-slate-500 mt-8 max-w-md mx-auto">
                    * Submitting saves your quote to your customer dashboard. An engineering specialist will inspect your blueprint and confirm the final contract value.
                  </p>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation Buttons */}
        {currentStep < 3 && (
          <div className="mt-12 pt-6 border-t border-slate-200 dark:border-slate-800 flex justify-between">
            <Button
              variant="ghost"
              onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
              disabled={currentStep === 0}
            >
              Back
            </Button>
            <Button
              variant="primary"
              onClick={() => setCurrentStep((prev) => Math.min(3, prev + 1))}
              className="gap-2"
            >
              Next Step <ArrowRight size={18} />
            </Button>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {submissionSuccess && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-md"
              onClick={() => setSubmissionSuccess(false)}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 16 }}
              className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-2xl border border-slate-200 dark:border-slate-800 z-10 text-center"
            >
              <button
                onClick={() => setSubmissionSuccess(false)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X size={18} />
              </button>

              <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={36} />
              </div>

              <h3 className="text-2xl font-heading font-bold text-slate-900 dark:text-white mb-2">
                Quote Submitted!
              </h3>
              <p className="text-sm text-slate-500 mb-6">
                Your request has been logged into our database. Our project manager will review the property parameters and reach out within 24 hours.
              </p>

              {createdLeadId && (
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl mb-6 text-xs text-slate-500 font-mono">
                  Ref ID: {createdLeadId.slice(0, 8)}...
                </div>
              )}

              <div className="space-y-3">
                <Link href="/customer/dashboard" className="block">
                  <Button className="w-full">View In My Dashboard</Button>
                </Link>
                <Button
                  variant="ghost"
                  className="w-full"
                  onClick={() => {
                    setSubmissionSuccess(false);
                    setCurrentStep(0);
                  }}
                >
                  Start New Calculation
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </div>
  );
}
