import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import LayoutShell from "@/components/LayoutShell";
import { getSections } from "@/lib/db";
import { getSubsections } from "@/lib/db";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Digital Security Toolkit - Sri Lanka",
  description: "A comprehensive guide to digital security, cyber threat response, and safe online practices for Sri Lankan internet users.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const sections = await getSections();
  const subsectionsBySection: Record<number, any[]> = {};
  for (const section of sections) {
    subsectionsBySection[section.id] = await getSubsections(section.id);
  }

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="bg-slate-900 text-slate-200" suppressHydrationWarning>
        <AuthProvider>
          <LayoutShell sections={sections} subsectionsBySection={subsectionsBySection}>
            {children}
          </LayoutShell>
        </AuthProvider>
      </body>
    </html>
  );
}
