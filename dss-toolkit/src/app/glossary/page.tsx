import { getGlossaryTerms } from '@/lib/db';

function groupByLetter(terms: any[]) {
  const groups: Record<string, any[]> = {};
  for (const term of terms) {
    const letter = term.term.charAt(0).toUpperCase();
    if (!groups[letter]) groups[letter] = [];
    groups[letter].push(term);
  }
  const sorted = Object.keys(groups).sort();
  return sorted.map((letter) => ({ letter, terms: groups[letter] }));
}

export default async function GlossaryPage() {
  const terms = await getGlossaryTerms();
  const grouped = groupByLetter(terms);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="relative mb-10 p-6 lg:p-8 rounded-2xl overflow-hidden border border-slate-700/50 bg-gradient-to-br from-slate-800/40 via-slate-900/40 to-slate-800/40">
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 rounded-full bg-purple-500/10 text-[10px] font-mono text-purple-400 border border-purple-500/20">
              Reference
            </span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold gradient-text mb-2">Glossary of Terms</h1>
          <p className="text-sm text-slate-400 leading-relaxed max-w-xl">
            Common cybersecurity terms explained in simple language. Click a term to copy its definition.
          </p>
          <div className="flex flex-wrap gap-1.5 mt-4">
            {grouped.map(({ letter }) => (
              <a key={letter} href={`#letter-${letter}`}
                className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-xs font-mono text-slate-400 hover:bg-cyan-500/10 hover:text-cyan-400 border border-slate-700 hover:border-cyan-500/30 transition-all">
                {letter}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {grouped.map(({ letter, terms: letterTerms }, gi) => (
          <section key={letter} id={`letter-${letter}`} className="scroll-mt-20">
            <div className="flex items-center gap-3 mb-3">
              <span className="w-8 h-8 rounded-xl bg-cyan-500/10 flex items-center justify-center text-sm font-bold text-cyan-400 font-mono">
                {letter}
              </span>
              <div className="h-px flex-1 bg-gradient-to-r from-slate-700/50 to-transparent" />
              <span className="text-[10px] text-slate-600">{letterTerms.length} terms</span>
            </div>

            <div className="space-y-2 stagger-enter">
              {letterTerms.map((term: any, i: number) => (
                <div key={term.id}
                  className="group p-4 rounded-xl bg-slate-800/30 border border-slate-700/50 hover:border-cyan-500/20 hover:bg-slate-800/50 transition-all duration-300 hover:-translate-y-0.5"
                  style={{ animationDelay: `${i * 50}ms` }}>
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-cyan-500/40 shrink-0 group-hover:bg-cyan-400 group-hover:scale-125 transition-all" />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-cyan-300 mb-0.5 group-hover:text-cyan-200 transition-colors">
                        {term.term}
                      </h3>
                      <p className="text-sm text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">
                        {term.definition}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
