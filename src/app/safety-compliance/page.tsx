import React from "react";
import Link from "next/link";
import { ShieldCheck, Zap, Activity, CheckCircle2, Phone, Mail, ArrowLeft, AlertCircle } from "lucide-react";

export const metadata = {
  title: "Safety Compliance & Standards | Jay Ganesh Electrical",
  description: "IS:732 BIS wiring standards, FRLS copper insulation, 10kA MCB / 30mA RCCB life protection, and Megger pre-commissioning testing by Jay Ganesh Electrical.",
};

export default function SafetyCompliancePage() {
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
            <ShieldCheck size={14} />
            <span>National Electrical Standards &amp; Life Safety</span>
          </div>
          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-slate-900 dark:text-white tracking-tight">
            Safety Compliance &amp; Engineering Codes
          </h1>
          <p className="mt-3 text-slate-600 dark:text-zinc-400 text-base leading-relaxed">
            Every electrical installation executed by Jay Ganesh Electrical is strictly governed by the Bureau of Indian Standards (IS:732) and the National Electrical Code of India (NEC).
          </p>
        </div>

        {/* Section 1: IS:732 Conduit & Routing Code */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
              <Zap size={20} />
            </div>
            <h2 className="font-heading font-bold text-xl text-slate-900 dark:text-white">
              1. IS:732 Code of Practice for Electrical Wiring Installations
            </h2>
          </div>
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-zinc-900/60 border border-slate-200/80 dark:border-zinc-800/80 space-y-4 text-sm leading-relaxed text-slate-600 dark:text-zinc-400">
            <p>
              We adhere to the <strong>Bureau of Indian Standards IS:732</strong> code to prevent electrical fires, overheating, and short-circuit hazards:
            </p>
            <ul className="space-y-2.5 pl-2">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={16} className="text-amber-500 shrink-0 mt-0.5" />
                <span><strong>Conduit Fill Ratio (&le; 40%):</strong> Total cross-sectional cable area never exceeds 40% of conduit internal capacity, ensuring continuous thermal dissipation.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={16} className="text-amber-500 shrink-0 mt-0.5" />
                <span><strong>Virgin uPVC Conduits:</strong> High-impact, heavy-duty mechanical strength conduits resistant to slab concrete vibration, settlement, and chemical degradation.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={16} className="text-amber-500 shrink-0 mt-0.5" />
                <span><strong>Strict Separation of High &amp; Low Voltage:</strong> Power cables (230V/415V) run in isolated conduits away from CAT6 data, automation bus, and intercom wiring to prevent EMI interference.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={16} className="text-amber-500 shrink-0 mt-0.5" />
                <span><strong>Independent Neutral Conductors:</strong> Each circuit possesses its dedicated neutral wire directly from the distribution board; zero shared neutrals across phases.</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Section 2: FRLS Copper Conductor Standards */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
              <Activity size={20} />
            </div>
            <h2 className="font-heading font-bold text-xl text-slate-900 dark:text-white">
              2. FRLS / HFFR Multi-Strand Electrolytic Copper Conductors
            </h2>
          </div>
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-zinc-900/60 border border-slate-200/80 dark:border-zinc-800/80 space-y-4 text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
            <p>
              We install only certified <strong>Fire-Retardant Low Smoke (FRLS)</strong> or <strong>Halogen-Free Flame Retardant (HFFR)</strong> 100% electrolytic annealed copper cables (Polycab / Havells / Finolex):
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-4 rounded-xl bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800">
                <div className="font-bold text-slate-900 dark:text-white text-sm">Oxygen Index &gt; 29%</div>
                <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">Self-extinguishing compound prevents fire propagation along vertical wall chases.</p>
              </div>
              <div className="p-4 rounded-xl bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800">
                <div className="font-bold text-slate-900 dark:text-white text-sm">Low Smoke Generation</div>
                <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">Light transmission &gt; 60% during flame exposure ensures clear emergency visibility.</p>
              </div>
              <div className="p-4 rounded-xl bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800">
                <div className="font-bold text-slate-900 dark:text-white text-sm">Acid Gas Emission &lt; 20%</div>
                <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">Minimizes toxic halogen gas release, protecting human respiration and sensitive electronics.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Earthing & Human Life Protection */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
              <ShieldCheck size={20} />
            </div>
            <h2 className="font-heading font-bold text-xl text-slate-900 dark:text-white">
              3. Earthing &amp; Human Life Protection Switchgear
            </h2>
          </div>
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-zinc-900/60 border border-slate-200/80 dark:border-zinc-800/80 space-y-4 text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800">
                <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1">Maintenance-Free Chemical Earthing</h4>
                <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
                  Copper-bonded steel electrode encased in moisture-retaining carbon bentonite compound. Resistance verified below <strong>2.0 Ohms</strong> with an independent test link chamber.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800">
                <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1">30mA RCCB Shock Prevention</h4>
                <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
                  High-sensitivity 30 milliamp Residual Current Circuit Breakers trip within <strong>30 milliseconds</strong> on minor earth leakages, preventing lethal electric shocks.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800">
                <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1">10kA Short-Circuit MCBs</h4>
                <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
                  Heavy-duty Type-C industrial breaking capacity withstands high fault currents without welding internal contact tips during short circuits.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800">
                <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1">Type 2 Surge Protective Device (SPD)</h4>
                <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
                  Clamps lightning transients and grid over-voltage spikes before they can damage inverter drives, home automation controllers, and OLED TVs.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Megger Pre-Commissioning Testing */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
              <AlertCircle size={20} />
            </div>
            <h2 className="font-heading font-bold text-xl text-slate-900 dark:text-white">
              4. Pre-Commissioning Megger Testing Protocol
            </h2>
          </div>
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-zinc-900/60 border border-slate-200/80 dark:border-zinc-800/80 space-y-3 text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
            <p>
              Before any circuit is energised with live grid power, our certified contracting engineers conduct mandatory testing:
            </p>
            <div className="space-y-2.5 pt-1">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 size={16} className="text-amber-500 shrink-0 mt-0.5" />
                <span><strong>500V DC Insulation Resistance (Megger Test):</strong> Verifies insulation integrity between Phase-to-Neutral, Phase-to-Earth, and Neutral-to-Earth (&gt; 100 M&Omega; standard).</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 size={16} className="text-amber-500 shrink-0 mt-0.5" />
                <span><strong>Loop Impedance &amp; Earth Continuity Audit:</strong> Confirms unbroken physical bonding across all 3-pin power receptacles and metal appliance chassis.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 size={16} className="text-amber-500 shrink-0 mt-0.5" />
                <span><strong>Phase Balancing &amp; Neutral Load Distribution:</strong> 3-phase circuits are balanced evenly across R, Y, and B to eliminate neutral overheating.</span>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Footer Banner */}
        <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white">Need an electrical audit or IS:732 certification?</h3>
            <p className="text-xs text-slate-600 dark:text-zinc-400 mt-0.5">Direct technical consultation for architects, developers, and homeowners.</p>
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
