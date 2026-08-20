import { getResources } from '@/lib/db';

function CategoryIcon({ category }: { category: string }) {
  const icons: Record<string, React.ReactNode> = {
    'Security Tools': <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />,
    'Government': <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />,
    'Reporting': <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
    'Education': <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />,
  };
  const icon = icons[category] || <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />;

  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      {icon}
    </svg>
  );
}

const categoryColors: Record<string, string> = {
  'Security Tools': 'from-cyan-500/10 to-transparent border-cyan-500/20 text-cyan-400',
  'Government': 'from-blue-500/10 to-transparent border-blue-500/20 text-blue-400',
  'Reporting': 'from-red-500/10 to-transparent border-red-500/20 text-red-400',
  'Education': 'from-purple-500/10 to-transparent border-purple-500/20 text-purple-400',
};

export default async function ResourcesPage() {
  const resources = await getResources();
  const categories = [...new Set(resources.map((r: any) => r.category))];

  return (
    <div className="max-w-3xl mx-auto">
      <div className="relative mb-10 p-6 lg:p-8 rounded-2xl overflow-hidden border border-slate-700/50 bg-gradient-to-br from-slate-800/40 via-slate-900/40 to-slate-800/40">
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-green-500/5 rounded-full blur-3xl" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 rounded-full bg-green-500/10 text-[10px] font-mono text-green-400 border border-green-500/20">
              Resources
            </span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold gradient-text mb-2">Tools & Resources</h1>
          <p className="text-sm text-slate-400 leading-relaxed max-w-xl">
            Recommended security tools and trusted information sources to help you stay safe online.
          </p>
        </div>
      </div>

      <div className="space-y-8">
        {categories.map((category, ci) => {
          const catResources = resources.filter((r: any) => r.category === category);
          const colors = categoryColors[category] || 'from-slate-500/10 to-transparent border-slate-500/20 text-slate-400';

          return (
            <section key={category} className="animate-fade-in-up" style={{ animationDelay: `${ci * 100}ms` }}>
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${colors} border flex items-center justify-center`}>
                  <CategoryIcon category={category} />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-sm font-semibold text-slate-200">{category}</h2>
                </div>
                <span className="text-[10px] text-slate-600">{catResources.length} items</span>
              </div>

              <div className="space-y-2">
                {catResources.map((resource: any, ri: number) => (
                  <div key={resource.id}
                    className="group p-3.5 rounded-xl bg-slate-800/30 border border-slate-700/50 hover:border-green-500/20 hover:bg-slate-800/50 transition-all duration-300 hover:-translate-y-0.5"
                    style={{ animationDelay: `${ri * 50}ms` }}>
                    <div className="flex items-center justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-medium text-slate-200 group-hover:text-green-200 transition-colors truncate">
                          <span className="mr-2 text-slate-600">&bull;</span>
                          {resource.name}
                        </h3>
                        {resource.description && (
                          <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{resource.description}</p>
                        )}
                      </div>
                      {resource.url && (
                        <a href={resource.url} target="_blank" rel="noopener noreferrer"
                          className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-500/10 text-green-400 text-xs hover:bg-green-500/20 border border-green-500/20 transition-all group/link">
                          Visit
                          <svg className="w-3 h-3 transition-transform group-hover/link:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
