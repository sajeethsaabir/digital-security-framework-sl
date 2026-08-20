'use client';

import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import SearchBar from './SearchBar';
import { UserButton } from './UserButton';

interface Section {
  id: number;
  section_number: string;
  title: string;
  anchor_id: string;
  sort_order: number;
}

interface Subsection {
  id: number;
  section_id: number;
  subsection_number: string;
  title: string;
  anchor_id: string;
  sort_order: number;
}

export default function LayoutShell({
  children,
  sections,
  subsectionsBySection,
}: {
  children: React.ReactNode;
  sections: Section[];
  subsectionsBySection: Record<number, Subsection[]>;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    if (!isMobile) setSidebarOpen(false);
  }, [isMobile]);

  return (
    <div className="flex min-h-screen">
      {/* Desktop sidebar */}
      <div className="hidden md:block">
        <Sidebar sections={sections} subsectionsBySection={subsectionsBySection} />
      </div>

      {/* Mobile sidebar overlay */}
      {isMobile && sidebarOpen && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-72 animate-slide-in-left">
            <Sidebar sections={sections} subsectionsBySection={subsectionsBySection} />
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        <header className="sticky top-0 z-40 border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-md">
          <div className="flex items-center justify-between px-3 sm:px-4 lg:px-6 py-2.5 sm:py-3">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              {/* Hamburger */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition-colors shrink-0"
                aria-label="Toggle sidebar"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {sidebarOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse shrink-0" />
                <span className="text-[10px] sm:text-xs text-slate-500 font-mono truncate">Digital Security Framework v1.0</span>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 shrink-0">
              <SearchBar />
              <UserButton />
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
          {children}
        </main>
        <footer className="border-t border-slate-700/50 px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 text-[10px] sm:text-xs text-slate-500">
            <span>Digital Security Framework, Sri Lanka</span>
            <span>Version 1.0 &middot; Last Updated: October 2025</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
