import type { Metadata } from "next";
import { Rubik, Nunito_Sans } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const rubik = Rubik({
  variable: "--font-rubik",
  subsets: ["latin"],
});

const nunitoSans = Nunito_Sans({
  variable: "--font-nunito-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Jay Ganesh Electrical | Premium Supply & Contracting",
  description: "Shop premium electricals and book expert wiring services. Digital catalog and lead-generation tool for Jay Ganesh Electrical.",
};

import { ThemeProvider } from "@/components/ThemeProvider";
import { SplashScreen } from "@/components/SplashScreen";
import { VisitorTracker } from "@/components/VisitorTracker";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${rubik.variable} ${nunitoSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground transition-colors duration-300 relative">
        {/* Hardware-accelerated Atmospheric Lighting Background (Lag-Free on Mobile) */}
        <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden transform-gpu" aria-hidden="true">
          {/* Mobile lightweight gradient layer (Zero blur cost, smooth 60fps) */}
          <div className="hidden dark:block md:hidden absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(255,255,255,0.04),transparent_70%),radial-gradient(ellipse_70%_50%_at_0%_40%,rgba(29,78,216,0.10),transparent_60%),radial-gradient(ellipse_70%_50%_at_100%_45%,rgba(217,119,6,0.08),transparent_60%)]" />
          
          {/* Desktop high-fidelity ambient layers */}
          <div className="hidden dark:md:block absolute top-[-10%] left-1/2 -translate-x-1/2 w-[80vw] h-[450px] bg-white/[0.035] rounded-full blur-[120px] will-change-transform" />
          <div className="hidden dark:md:block absolute top-[25%] left-[-15%] w-[50vw] h-[700px] bg-blue-900/[0.12] rounded-full blur-[130px] will-change-transform" />
          <div className="hidden dark:md:block absolute top-[35%] right-[-15%] w-[50vw] h-[700px] bg-amber-800/[0.09] rounded-full blur-[130px] will-change-transform" />
          <div className="hidden dark:md:block absolute bottom-[-10%] left-1/2 -translate-x-1/2 w-[90vw] h-[600px] bg-slate-900/[0.22] rounded-full blur-[140px] will-change-transform" />
        </div>

        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <VisitorTracker />
          <SplashScreen duration={1300}>
            <Navbar />
            <main className="flex-1 flex flex-col">
              {children}
            </main>
            <Footer />
          </SplashScreen>
        </ThemeProvider>
      </body>
    </html>
  );
}
