'use client';

import Link from 'next/link';
import { useState } from 'react';

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

export default function Sidebar({
  sections,
  subsectionsBySection,
  currentSectionId,
}: {
  sections: Section[];
  subsectionsBySection: Record<number, Subsection[]>;
  currentSectionId?: number;
}) {
  const [expandedSections, setExpandedSections] = useState<Set<number>>(
    () => new Set(currentSectionId ? [currentSectionId] : [])
  );

  const toggleSection = (id: number) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <aside className="w-72 shrink-0 h-screen sticky top-0 overflow-y-auto border-r border-slate-700/50 bg-slate-900/70 backdrop-blur-sm">
      <div className="relative p-4 border-b border-slate-700/50 overflow-hidden">
        <div className="absolute -top-6 -right-6 w-20 h-20 bg-cyan-500/5 rounded-full blur-xl" />
        <Link href="/" className="flex items-center gap-2 relative">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <div>
            <div className="font-bold text-sm text-slate-100">Digital Security Framework</div>
            <div className="text-[10px] text-slate-500 font-mono">v1.0 &middot; Sri Lanka</div>
          </div>
        </Link>
      </div>

      <nav className="p-2 space-y-0.5">
        {sections.map((section, idx) => {
          const subs = subsectionsBySection[section.id] || [];
          const isActive = currentSectionId === section.id;
          const isExpanded = expandedSections.has(section.id);
          return (
            <div key={section.id} className="animate-fade-in-up" style={{ animationDelay: `${idx * 50}ms` }}>
              <button
                onClick={() => toggleSection(section.id)}
                className={`group relative flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm transition-all duration-200 text-left ${
                  isActive
                    ? 'bg-cyan-500/10 text-cyan-300 font-medium'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400/50" />
                )}
                <span className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-mono shrink-0 transition-all duration-200 ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-300'
                    : 'bg-slate-800 text-slate-500 group-hover:bg-slate-700'
                }`}>
                  {section.section_number || '~'}
                </span>
                <span className="truncate flex-1">{section.title}</span>
                <svg
                  className={`w-4 h-4 shrink-0 transition-transform duration-200 ${
                    isExpanded ? 'rotate-180' : ''
                  } ${isActive ? 'text-cyan-400' : 'text-slate-600'}`}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {subs.length > 0 && (
                <div
                  className={`overflow-hidden transition-all duration-200 ${
                    isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className={`ml-5 mt-0.5 space-y-0.5 border-l pl-3 ${
                    isActive ? 'border-cyan-500/30' : 'border-slate-700/50'
                  }`}>
                    {subs.map((sub) => (
                      <Link
                        key={sub.id}
                        href={`/sections/${section.id}#sub-${sub.id}`}
                        className="group flex items-center gap-2 px-3 py-1.5 text-xs text-slate-500 hover:text-slate-300 hover:bg-slate-800/30 rounded transition-all duration-150 truncate"
                      >
                        <span className="w-1 h-1 rounded-full bg-slate-600 group-hover:bg-cyan-500 transition-colors shrink-0" />
                        {sub.subsection_number && (
                          <span className="text-slate-600 font-mono">{sub.subsection_number}</span>
                        )}
                        <span className="truncate">{sub.title}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <div className="p-3 border-t border-slate-700/50 mt-2">
        <div className="space-y-0.5">
          <Link
            href="/learn"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-purple-400 hover:text-purple-300 hover:bg-purple-500/5 transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            Learning Center
          </Link>
          <Link
            href="/emergency"
            className="group relative flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-all"
          >
            <span className="absolute inset-0 rounded-lg bg-red-500/0 group-hover:bg-red-500/5 transition-colors" />
            <span className="relative flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              Emergency Contacts
            </span>
          </Link>
          <Link
            href="/glossary"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            Glossary
          </Link>
          <Link
            href="/resources"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Tools & Resources
          </Link>
        </div>
      </div>
    </aside>
  );
}
