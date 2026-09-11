"use client";

import React, { useState } from "react";
import { X, Network } from "lucide-react";
import { Button } from "./ui/Button";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "./ui/Card";

export function RoleRoutingDiagram() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button 
        variant="outline" 
        onClick={() => setIsOpen(true)}
        className="gap-2 text-brand-blue border-brand-blue/30 hover:bg-brand-blue/5"
      >
        <Network size={16} /> View Routing Architecture
      </Button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-4xl max-h-[90vh] flex flex-col glass rounded-3xl border border-white/20 shadow-2xl overflow-hidden"
            >
              <div className="flex justify-between items-center p-4 sm:p-6 border-b border-slate-200 dark:border-slate-700/50">
                <h2 className="text-xl font-bold">Secure Role-Based Routing Architecture</h2>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="rounded-full">
                  <X size={20} />
                </Button>
              </div>
              
              <div className="p-4 sm:p-6 overflow-y-auto bg-slate-50 dark:bg-slate-900 flex-1 flex justify-center">
                <Card className="w-full p-4 sm:p-8 bg-white dark:bg-slate-950 overflow-x-auto hide-scrollbar">
                  <pre className="text-sm mermaid-mock">
                    {`graph TD
    A[Root: /] -->|Auth Check| B{Is Authenticated?}
    
    B -->|No| C[Auth Modal]
    C -->|Success| B
    
    B -->|Yes| D{Check Role}
    
    D -->|Role: Admin| E[Admin Routing Group]
    E --> E1[/dashboard]
    E1 --> E2(Analytics Tab)
    E1 --> E3(Leads Tab)
    E1 --> E4(Inventory Tab)
    E1 --> E5(Projects Tab)
    E1 --> E6(Staff Tab)
    
    D -->|Role: User| F[User Routing Group]
    F --> F1[/dashboard]
    F1 --> F2(Profile Tab)
    F1 --> F3(Wishlist Tab)
    F1 --> F4(Tracker Tab)
    
    %% Styling
    classDef default fill:#f8fafc,stroke:#cbd5e1,stroke-width:2px,color:#0f172a,rx:8px,ry:8px
    classDef dark fill:#0f172a,stroke:#334155,stroke-width:2px,color:#f8fafc,rx:8px,ry:8px
    classDef auth fill:#e0f2fe,stroke:#38bdf8,stroke-width:2px,color:#0284c7
    classDef admin fill:#fef3c7,stroke:#f59e0b,stroke-width:2px,color:#b45309
    classDef user fill:#ecfdf5,stroke:#10b981,stroke-width:2px,color:#047857
    
    class A,B,C,D auth
    class E,E1,E2,E3,E4,E5,E6 admin
    class F,F1,F2,F3,F4 user`}
                  </pre>
                  
                  {/* Note: In a real app we'd use a mermaid react component. We will mock the visual representation below the pre block for immediate viewing */}
                  <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800">
                    <p className="text-sm text-slate-500 mb-4 text-center">Visual Representation:</p>
                    
                    <div className="flex flex-col items-center gap-6 text-sm">
                      <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-xl border-2 border-blue-300 font-medium">Authentication Gateway</div>
                      <div className="h-8 border-l-2 border-slate-300 border-dashed" />
                      
                      <div className="flex flex-col md:flex-row gap-8 md:gap-16 w-full max-w-2xl justify-center relative">
                        {/* Connecting horizontal line */}
                        <div className="hidden md:block absolute top-6 left-1/4 right-1/4 h-[2px] bg-slate-300 border-dashed border-t-2" />
                        
                        {/* Admin Path */}
                        <div className="flex flex-col items-center flex-1 z-10">
                          <div className="bg-amber-100 text-amber-800 px-6 py-3 rounded-2xl border-2 border-amber-300 font-bold w-full text-center mb-4">
                            Admin Role
                          </div>
                          <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm space-y-2">
                            <div className="bg-amber-50 dark:bg-amber-900/20 p-2 rounded text-center">Analytics</div>
                            <div className="bg-amber-50 dark:bg-amber-900/20 p-2 rounded text-center">Leads Management</div>
                            <div className="bg-amber-50 dark:bg-amber-900/20 p-2 rounded text-center">Inventory Control</div>
                            <div className="bg-amber-50 dark:bg-amber-900/20 p-2 rounded text-center">Project Status</div>
                            <div className="bg-amber-50 dark:bg-amber-900/20 p-2 rounded text-center">Staff Assignment</div>
                          </div>
                        </div>

                        {/* User Path */}
                        <div className="flex flex-col items-center flex-1 z-10">
                          <div className="bg-emerald-100 text-emerald-800 px-6 py-3 rounded-2xl border-2 border-emerald-300 font-bold w-full text-center mb-4">
                            Customer Role
                          </div>
                          <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm space-y-2">
                            <div className="bg-emerald-50 dark:bg-emerald-900/20 p-2 rounded text-center">Profile Settings</div>
                            <div className="bg-emerald-50 dark:bg-emerald-900/20 p-2 rounded text-center">Product Wishlist</div>
                            <div className="bg-emerald-50 dark:bg-emerald-900/20 p-2 rounded text-center">Project Tracker</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                </Card>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
