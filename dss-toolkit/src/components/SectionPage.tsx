import ContentRenderer from './ContentRenderer';
import { sectionGraphics, sectionColors, sectionTheme } from './SectionGraphics';

const sectionAccentKeys: Record<string, string> = {
  '': 'cyan',
  '1': 'red',
  '2': 'cyan',
  '3': 'emerald',
  '4': 'yellow',
  '5': 'orange',
  '6': 'red',
};

interface Section {
  id: number;
  section_number: string;
  title: string;
}

interface Subsection {
  id: number;
  subsection_number: string;
  title: string;
}

interface ContentBlock {
  id: number;
  content_type: string;
  content: string;
  level: number;
  subsection_id: number | null;
}

function SectionIllustration({ num }: { num: string }) {
  const Graphic = sectionGraphics[num] || sectionGraphics[''];
  const color = sectionColors[num] || sectionColors[''];
  return <Graphic color={color} />;
}

export default async function SectionPage({
  section,
  subsections,
  contentBlocks,
}: {
  section: Section;
  subsections: Subsection[];
  contentBlocks: ContentBlock[];
}) {
  const subsectionBlocks = subsections.map((sub) => ({
    sub,
    blocks: contentBlocks.filter((b) => b.subsection_id === sub.id),
  }));

  const sectionBlocks = contentBlocks.filter((b) => b.subsection_id === null);
  const num = section.section_number;
  const theme = sectionTheme[num] || sectionTheme[''];
  const color = sectionColors[num] || sectionColors[''];
  const accentKey = sectionAccentKeys[num] || 'cyan';

  return (
    <div className="max-w-3xl mx-auto">
      {/* Section Header */}
      <div className={`relative mb-8 sm:mb-10 p-5 sm:p-6 lg:p-8 rounded-2xl overflow-hidden border bg-gradient-to-br ${theme.bg} ${theme.border}`}>
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full blur-2xl" style={{ backgroundColor: `${color}08` }} />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full blur-2xl" style={{ backgroundColor: `${color}05` }} />

        <div className="relative flex items-start gap-4 sm:gap-5">
          <div className="hidden sm:block w-24 h-24 lg:w-32 lg:h-32 shrink-0 animate-float">
            <SectionIllustration num={num} />
          </div>
          <div className="flex-1 min-w-0 pt-1 sm:pt-2">
            <div className="flex items-center gap-2 mb-2">
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono border ${theme.badge}`}>
                {num ? `Section ${num}` : 'Overview'}
              </span>
              <span className="text-[10px] text-slate-600">{subsections.length} topics</span>
            </div>
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-100 leading-tight">
              {num && (
                <span className={`font-mono mr-2 ${theme.accent}`}>{num}.</span>
              )}
              {section.title}
            </h1>
            {sectionBlocks.length > 0 && (
              <div className={`mt-3 sm:mt-4 p-3 sm:p-4 rounded-lg border ${theme.border.replace('hover:', '')}`}
                style={{ backgroundColor: `${color}04` }}>
                <ContentRenderer blocks={sectionBlocks} accentColor={accentKey} />
              </div>
            )}
            {/* Section tags */}
            <div className="flex flex-wrap gap-1.5 mt-3 sm:mt-4">
              {subsectionBlocks.map(({ sub }) => (
                <a key={sub.id} href={`#sub-${sub.id}`}
                  className="px-2 py-0.5 rounded-md bg-slate-800 text-[10px] text-slate-500 border border-slate-700/50 hover:text-slate-300 hover:border-slate-600 transition-all truncate max-w-36 sm:max-w-40">
                  {sub.subsection_number && `${sub.subsection_number} `}{sub.title}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Subsections */}
      <div className="space-y-6 sm:space-y-8">
        {subsectionBlocks.map(({ sub, blocks }, idx) => (
          <div key={sub.id}>
            {idx > 0 && (
              <div className="flex items-center gap-3 py-2 text-slate-700/30">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-700/40 to-transparent" />
                <svg className="w-8 h-8 opacity-30" viewBox="0 0 40 16" fill="none" stroke="currentColor" strokeWidth="0.5">
                  <circle cx="20" cy="8" r="6" stroke={`${color}60`} fill={`${color}10`} />
                  <circle cx="8" cy="8" r="3" stroke={`${color}40`} />
                  <circle cx="32" cy="8" r="3" stroke={`${color}40`} />
                  <path d="M14 8h12" stroke={`${color}30`} />
                </svg>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-700/40 to-transparent" />
              </div>
            )}
            <section id={`sub-${sub.id}`} className="scroll-mt-20 sm:scroll-mt-24">
              {/* Subsection card */}
              <div className="rounded-xl bg-slate-800/20 border border-slate-700/20 animate-fade-in-up"
                style={{ animationDelay: `${idx * 80}ms` }}>
                {/* Subsection header */}
                <div className="px-4 sm:px-6 pt-4 sm:pt-5 pb-3 sm:pb-4 border-b border-slate-700/20">
                  <div className="flex items-center gap-2 sm:gap-3 mb-1">
                    <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-lg flex items-center justify-center ${theme.icon}`}>
                      <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                    {sub.subsection_number && (
                      <span className="px-2 py-0.5 rounded-md bg-slate-800/80 text-[10px] sm:text-[11px] font-mono text-slate-500 border border-slate-700/50">
                        {sub.subsection_number}
                      </span>
                    )}
                    <div className="flex-1" />
                    <span className="text-[10px] text-slate-600">{blocks.length} items</span>
                  </div>
                  <h2 className={`text-base sm:text-lg lg:text-xl font-bold ${theme.accent} mt-1`}>
                    {sub.title}
                  </h2>
                </div>

                {/* Content area */}
                <div className="px-4 sm:px-6 py-4 sm:py-5">
                  {blocks.length > 0 ? (
                    <ContentRenderer blocks={blocks} accentColor={accentKey} />
                  ) : (
                    <div className="flex items-center gap-2 p-3 sm:p-4 rounded-lg bg-slate-800/30 border border-slate-700/20 text-sm text-slate-600 italic">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Content coming soon
                    </div>
                  )}
                </div>
              </div>
            </section>
          </div>
        ))}
      </div>

      {/* Footer decoration */}
      <div className="mt-10 sm:mt-12 flex items-center gap-3 text-[10px] sm:text-xs text-slate-700">
        <div className="h-px flex-1 bg-gradient-to-r from-slate-700/50 to-transparent" />
        <span className="font-mono">End of Section {num || 'Overview'}</span>
        <div className="h-px flex-1 bg-gradient-to-l from-slate-700/50 to-transparent" />
      </div>
    </div>
  );
}
