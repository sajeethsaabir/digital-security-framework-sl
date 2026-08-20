import Link from 'next/link';
import { getLearningPaths } from '@/lib/db';

const iconMap: Record<string, React.ReactNode> = {
  alert: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
  lock: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />,
  shield: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />,
  star: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />,
  report: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />,
  emergency: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
  book: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />,
};

const difficultyColors: Record<string, string> = {
  beginner: 'bg-green-500/10 text-green-400 border-green-500/20',
  intermediate: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  advanced: 'bg-red-500/10 text-red-400 border-red-500/20',
};

export default async function LearnPage() {
  const paths = await getLearningPaths();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="relative mb-10 p-6 lg:p-8 rounded-2xl overflow-hidden border border-slate-700/50 bg-gradient-to-br from-slate-800/40 via-purple-900/20 to-slate-800/40">
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 rounded-full bg-purple-500/10 text-[10px] font-mono text-purple-400 border border-purple-500/20">
              Interactive
            </span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold gradient-text mb-2">Learning Center</h1>
          <p className="text-sm text-slate-400 leading-relaxed max-w-2xl">
            Work through each learning path at your own pace. Complete all paths and quizzes
            to earn your Digital Security Certificate.
          </p>
          <div className="flex flex-wrap gap-3 mt-4">
            <span className="flex items-center gap-1.5 text-xs text-slate-500">
              <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              {paths.reduce((a, p: any) => a + Number(p.step_count), 0)} steps
            </span>
            <span className="flex items-center gap-1.5 text-xs text-slate-500">
              <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {paths.reduce((a, p: any) => a + Number(p.question_count), 0)} quiz questions
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-3 stagger-enter">
        {paths.map((path: any, i: number) => {
          const icon = iconMap[path.icon] || iconMap.book;
          const diffColor = difficultyColors[path.difficulty] || difficultyColors.beginner;

          return (
            <Link key={path.id} href={`/learn/${path.id}`} className="block group">
              <div className="relative p-5 rounded-xl bg-slate-800/30 border border-slate-700/50 hover:border-purple-500/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-purple-500/5">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 shrink-0 group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">{icon}</svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-semibold text-slate-200 group-hover:text-purple-200 transition-colors">
                        {path.title}
                      </h3>
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono border ${diffColor}`}>
                        {path.difficulty}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed mb-2">{path.description}</p>
                    <div className="flex items-center gap-3 text-[10px] text-slate-600">
                      <span>{path.step_count} steps</span>
                      <span>{path.estimated_minutes} min</span>
                      {path.question_count > 0 && <span>{path.question_count} questions</span>}
                    </div>
                  </div>
                  <svg className="w-5 h-5 text-slate-600 group-hover:text-purple-400 transition-colors shrink-0 mt-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Certificate CTA */}
      <div className="relative mt-10 p-5 lg:p-6 rounded-xl overflow-hidden border border-purple-500/20 bg-gradient-to-r from-purple-500/5 via-purple-500/3 to-transparent">
        <div className="relative flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-purple-300 mb-1">Earn Your Certificate</h3>
            <p className="text-xs text-slate-400 mb-3 leading-relaxed">
              Complete all learning paths and pass all quizzes to earn your official
              Completion certificate for all learning paths.
            </p>
            <Link href="/learn/certificate"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-500/10 text-xs text-purple-300 hover:bg-purple-500/20 border border-purple-500/20 transition-all">
              View Certificate
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
