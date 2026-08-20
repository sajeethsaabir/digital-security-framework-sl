import Link from 'next/link';
import { getLearningPaths } from '@/lib/db';

export default async function CertificatePage() {
  const paths = await getLearningPaths();

  return (
    <div className="max-w-3xl mx-auto">
      <Link href="/learn" className="text-xs text-purple-400 hover:text-purple-300 transition-colors inline-flex items-center gap-1 mb-4">
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Learning Center
      </Link>

      <div className="relative p-8 lg:p-10 rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-800/40 via-slate-900/40 to-slate-800/40">
        <div className="relative text-center">
          <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-slate-100 mb-2">Certificate of Completion</h2>
          <p className="text-sm text-slate-500 mb-4 max-w-md mx-auto leading-relaxed">
            This static version of the toolkit does not track accounts or progress, so
            certificates can&apos;t be issued here. In the full interactive version, completing
            all {paths.length} learning paths and passing every quiz earns you an official
            Digital Security Framework certificate.
          </p>

          {/* Path list */}
          <div className="space-y-1.5 mb-6 text-left max-w-sm mx-auto">
            {paths.map((p: any, i: number) => (
              <div key={p.id} className="flex items-center gap-2 text-xs">
                <span className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 bg-slate-800 text-slate-600">
                  {String.fromCharCode(65 + i)}
                </span>
                <Link href={`/learn/${p.id}`} className="text-slate-500 hover:text-purple-300 transition-colors">
                  {p.title}
                </Link>
              </div>
            ))}
          </div>

          <Link href="/learn"
            className="inline-block px-5 py-2 rounded-xl bg-purple-500/10 text-sm text-purple-300 border border-purple-500/20 hover:bg-purple-500/20 transition-all">
            Continue Learning
          </Link>
        </div>
      </div>
    </div>
  );
}
