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
        {/* Subtle Atmospheric Lighting Background (From Agency Reference Image) */}
        <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden" aria-hidden="true">
          <div className="hidden dark:block absolute top-[-10%] left-1/2 -translate-x-1/2 w-[80vw] h-[450px] bg-white/[0.035] rounded-full blur-[140px]" />
          <div className="hidden dark:block absolute top-[25%] left-[-15%] w-[50vw] h-[700px] bg-blue-900/[0.13] rounded-full blur-[160px]" />
          <div className="hidden dark:block absolute top-[35%] right-[-15%] w-[50vw] h-[700px] bg-amber-800/[0.10] rounded-full blur-[160px]" />
          <div className="hidden dark:block absolute bottom-[-10%] left-1/2 -translate-x-1/2 w-[90vw] h-[600px] bg-slate-900/[0.25] rounded-full blur-[180px]" />
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
