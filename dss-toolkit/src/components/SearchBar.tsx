'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

interface SearchResult {
  id: number;
  content: string;
  content_type: string;
  section_id: number;
  section_title: string;
  subsection_title: string | null;
  subsection_id: number | null;
}

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data.results || []);
        setIsOpen(true);
      } catch {
        setResults([]);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div ref={wrapperRef} className="relative w-full max-w-md">
      <div className="relative">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search the toolkit..."
          className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all"
        />
      </div>
      {isOpen && results.length > 0 && (
        <div className="absolute top-full mt-1 w-full bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50 max-h-80 overflow-y-auto">
          {results.map((r) => (
            <Link
              key={r.id}
              href={r.subsection_id ? `/sections/${r.section_id}#sub-${r.subsection_id}` : `/sections/${r.section_id}`}
              onClick={() => { setIsOpen(false); setQuery(''); }}
              className="block px-4 py-3 hover:bg-slate-700/50 border-b border-slate-700/50 last:border-0 transition-colors"
            >
              <div className="text-xs text-cyan-400 mb-0.5">
                {r.section_title}
                {r.subsection_title && <span> &rarr; {r.subsection_title}</span>}
              </div>
              <div className="text-sm text-slate-300 line-clamp-2">{r.content}</div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
