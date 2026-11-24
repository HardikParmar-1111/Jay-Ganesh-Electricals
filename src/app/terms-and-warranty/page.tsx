import React from "react";
import Link from "next/link";
import { ShieldCheck, Award, FileText, CheckCircle2, Phone, Mail, ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Terms & Warranty Policy | Jay Ganesh Electrical",
  description: "Comprehensive contracting terms, execution milestones, and 10-year hardware warranty details for turnkey villa electrical installations by Jay Ganesh Electrical.",
};

export default function TermsAndWarrantyPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-slate-800 dark:text-zinc-200 pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back navigation */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-slate-500 hover:text-amber-500 dark:text-zinc-400 dark:hover:text-amber-400 mb-8 transition-colors"
        >
          <ArrowLeft size={14} /> Back to Home
        </Link>

        {/* Header */}
        <div className="border-b border-slate-200 dark:border-zinc-800 pb-8 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 mb-4">
            <Award size={14} />
            <span>Contractor Guarantee &amp; Commercial Terms</span>
          </div>
          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-slate-900 dark:text-white tracking-tight">
            Terms &amp; Warranty Policy
          </h1>
          <p className="mt-3 text-slate-600 dark:text-zinc-400 text-base leading-relaxed">
            Jay Ganesh Electrical delivers turnkey villa electrical contracting backed by transparent itemized BOQs, staged execution milestone guarantees, and OEM hardware warranties.
          </p>
        </div>

        {/* Section 1: Workmanship Warranty */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
              <ShieldCheck size={20} />
            </div>
            <h2 className="font-heading font-bold text-xl text-slate-900 dark:text-white">
              1. One-Year Comprehensive Workmanship Warranty
            </h2>
          </div>
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-zinc-900/60 border border-slate-200/80 dark:border-zinc-800/80 space-y-4 text-sm leading-relaxed text-slate-600 dark:text-zinc-400">
            <p>
              Every turnkey project executed by <strong>Jay Ganesh Electrical</strong> comes with a complimentary <strong>12-month post-handover warranty</strong> covering:
            </p>
            <ul className="space-y-2.5 pl-2">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={16} className="text-amber-500 shrink-0 mt-0.5" />
                <span><strong>Concealed Wiring Integrity:</strong> Guaranteed continuity and insulation of all circuits drawn through slab and wall conduits.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={16} className="text-amber-500 shrink-0 mt-0.5" />
                <span><strong>Distribution Board Dressing:</strong> Free rectification of loose terminal lugs, busbar torquing, or breaker calibration issues.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={16} className="text-amber-500 shrink-0 mt-0.5" />
                <span><strong>Earth Pit Continuity:</strong> Verification and servicing of chemical earthing resistance values under 2.0 Ohms.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={16} className="text-amber-500 shrink-0 mt-0.5" />
                <span><strong>Emergency Response:</strong> Priority breakdown attendance within 24 to 48 hours across Jetpur, Rajkot, and Saurashtra regions.</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Section 2: Hardware & OEM Warranties */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
              <Award size={20} />
            </div>
            <h2 className="font-heading font-bold text-xl text-slate-900 dark:text-white">
              2. Manufacturer Hardware Guarantees
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">Up to 10 Years</span>
              <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white mt-1 mb-2">Modular Switch Mechanisms</h3>
              <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                Direct OEM replacement guarantee on certified switch contacts and grid plates (Legrand, Schneider, Panasonic) tested for 100,000+ electrical clicks.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">2 to 5 Years</span>
              <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white mt-1 mb-2">Switchgear &amp; Breakers</h3>
              <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                Manufacturer warranty on 10kA Miniature Circuit Breakers (MCBs), 30mA RCCBs, Isolators, and double-door metal enclosure DBs.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">2 to 3 Years</span>
              <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white mt-1 mb-2">Architectural LED Drivers &amp; COB</h3>
              <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                Replacement warranty on constant-current isolated LED drivers, anti-glare COB downlights, and 4kV surge protected linear cove strips.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">Lifetime Material</span>
              <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white mt-1 mb-2">Concealed FRLS Copper Cables</h3>
              <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                100% pure electrolytic copper cables (Polycab, Finolex, Havells) with oxygen-free copper and self-extinguishing insulation.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: Contracting Milestones & Payment Terms */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
              <FileText size={20} />
            </div>
            <h2 className="font-heading font-bold text-xl text-slate-900 dark:text-white">
              3. Contracting Terms &amp; Execution Milestones
            </h2>
          </div>
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-zinc-900/60 border border-slate-200/80 dark:border-zinc-800/80 space-y-4 text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
            <p>
              We operate strictly on milestone-based billing with no hidden fees. Each stage is inspected and approved before the next commences:
            </p>
            <div className="space-y-3 pt-2">
              <div className="p-3.5 rounded-lg bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 flex items-start gap-3">
                <span className="font-mono text-xs font-bold px-2 py-1 rounded bg-amber-500/15 text-amber-600 dark:text-amber-400 shrink-0">Stage 1</span>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">RCC Slab Conduit Embedment (25%)</h4>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">Heavy-duty uPVC conduits, fan hook boxes, and downlight recesses positioned prior to concrete casting.</p>
                </div>
              </div>
              <div className="p-3.5 rounded-lg bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 flex items-start gap-3">
                <span className="font-mono text-xs font-bold px-2 py-1 rounded bg-amber-500/15 text-amber-600 dark:text-amber-400 shrink-0">Stage 2</span>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">Wall Chasing, Metal Boxes &amp; Earthing (30%)</h4>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">Precision vertical wall slots, galvanized metal modular back-boxes, and chemical earthing pit installation.</p>
                </div>
              </div>
              <div className="p-3.5 rounded-lg bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 flex items-start gap-3">
                <span className="font-mono text-xs font-bold px-2 py-1 rounded bg-amber-500/15 text-amber-600 dark:text-amber-400 shrink-0">Stage 3</span>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">FRLS Wire Pulling &amp; Distribution Board Dressing (25%)</h4>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">Separate phase/neutral/earth conductor pulling, ferrule numbering, breaker busbar termination, and phase balancing.</p>
                </div>
              </div>
              <div className="p-3.5 rounded-lg bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 flex items-start gap-3">
                <span className="font-mono text-xs font-bold px-2 py-1 rounded bg-amber-500/15 text-amber-600 dark:text-amber-400 shrink-0">Stage 4</span>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">Finishing, Megger Testing &amp; Commissioning Handover (20%)</h4>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">Mounting modular switch plates, architectural luminaires, Megger 500V insulation testing, and warranty certificate issuance.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Footer Banner */}
        <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white">Have questions about our warranty or terms?</h3>
            <p className="text-xs text-slate-600 dark:text-zinc-400 mt-0.5">Direct contractor consultation for luxury villas and residences.</p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <a
              href="tel:+919724921890"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-colors shadow-md shadow-amber-500/20"
            >
              <Phone size={14} /> +91 9724921890
            </a>
            <a
              href="mailto:jayganeshelectricals001@gmail.com"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-200 dark:bg-zinc-800 text-slate-900 dark:text-white font-medium text-xs hover:bg-slate-300 dark:hover:bg-zinc-700 transition-colors"
            >
              <Mail size={14} /> Email Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
