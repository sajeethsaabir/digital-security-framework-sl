'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';

export default function CertificatePage() {
  const { user, showAuthModal } = useAuth();
  const [cert, setCert] = useState<any>(null);
  const [allCerts, setAllCerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState<any[]>([]);
  const [paths, setPaths] = useState<any[]>([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!user) { setLoading(false); return; }

    Promise.all([
      fetch('/api/learn/certificate').then((r) => r.json()),
      fetch('/api/learn/progress').then((r) => r.json()),
      fetch('/api/learn/path-data?all=1').then((r) => r.json()),
    ]).then(([certData, progressData, pathData]) => {
      setCert(certData.certificate);
      setAllCerts(certData.all || []);
      setProgress(progressData.progress || []);
      setPaths(pathData.paths || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [user]);

  const generateCertificate = async () => {
    if (!user) { showAuthModal(); return; }
    setGenerating(true);
    setMessage('');
    try {
      const res = await fetch('/api/learn/certificate', { method: 'POST' });
      const data = await res.json();
      if (data.certificate) {
        setCert(data.certificate);
        setAllCerts((prev) => [data.certificate, ...prev]);
        setMessage('');
      } else {
        setMessage(data.error || 'Failed to generate certificate');
      }
    } catch {
      setMessage('Something went wrong');
    }
    setGenerating(false);
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-64 bg-slate-800 rounded-2xl" />
        </div>
      </div>
    );
  }

  const completedCount = paths.filter((p: any) =>
    progress.find((pr: any) => pr.path_id === p.id && pr.completed)
  ).length;

  return (
    <div className="max-w-3xl mx-auto">
      <Link href="/learn" className="text-xs text-purple-400 hover:text-purple-300 transition-colors inline-flex items-center gap-1 mb-4">
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Learning Center
      </Link>

      {cert ? (
        /* Certificate display */
        <div className="relative p-8 lg:p-10 rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/5 via-slate-900/40 to-slate-800/40 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-amber-500/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-purple-500/5 rounded-full blur-3xl" />

          <div className="relative border-2 border-amber-500/20 rounded-xl p-8 lg:p-10 bg-slate-900/60">
            {/* Decorative top */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-purple-500 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
            </div>

            <div className="text-center mb-6">
              <p className="text-xs text-amber-400/60 font-mono uppercase tracking-widest mb-2">Certificate of Completion</p>
              <h1 className="text-xl lg:text-2xl font-bold gradient-text-warm mb-2">Security Toolkit</h1>
              <p className="text-sm text-slate-400">This certifies that</p>
              <p className="text-lg font-bold text-amber-300 my-2">{user?.name || 'Student'}</p>
              <p className="text-sm text-slate-400">
                has successfully completed all learning paths and demonstrated proficiency in digital security fundamentals.
              </p>
            </div>

            {/* Progress summary */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                { label: 'Paths', value: completedCount, total: paths.length },
                { label: 'Quizzes Passed', value: progress.filter((p: any) => p.quiz_passed).length, total: paths.length },
                { label: 'Score', value: progress.reduce((a: number, p: any) => a + (p.quiz_score || 0), 0), total: progress.reduce((a: number, p: any) => a + (0), 0) || '—' },
              ].map((stat) => (
                <div key={stat.label} className="text-center p-3 rounded-lg bg-slate-800/50">
                  <div className="text-lg font-bold text-amber-400">{stat.value}{stat.total ? `/${stat.total}` : ''}</div>
                  <div className="text-[10px] text-slate-600">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Certificate code */}
            <div className="text-center">
              <p className="text-[10px] text-slate-600 font-mono">Certificate Code: {cert.certificate_code}</p>
              <p className="text-[10px] text-slate-600 mt-1">Issued: {new Date(cert.issued_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>

            {/* Action buttons */}
            <div className="flex justify-center gap-3 mt-6">
              <button onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-amber-500/10 text-amber-300 text-sm border border-amber-500/20 hover:bg-amber-500/20 transition-all">
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  Print Certificate
                </span>
              </button>
              <Link href="/learn"
                className="px-4 py-2 rounded-xl bg-slate-800 text-sm text-slate-300 border border-slate-700 hover:border-amber-500/30 transition-all">
                Continue Learning
              </Link>
            </div>
          </div>
        </div>
      ) : (
        /* No certificate yet */
        <div className="relative p-8 lg:p-10 rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-800/40 via-slate-900/40 to-slate-800/40">
          <div className="relative text-center">
            <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-slate-100 mb-2">No Certificate Yet</h2>
            <p className="text-sm text-slate-500 mb-4 max-w-md mx-auto leading-relaxed">
              Complete all {paths.length} learning paths and pass all quizzes to earn your certificate.
            </p>

            {/* Progress */}
            <div className="max-w-sm mx-auto mb-6">
              <div className="flex justify-between text-xs text-slate-600 mb-1.5">
                <span>Progress: {completedCount}/{paths.length} paths</span>
                <span>{Math.round((completedCount / (paths.length || 1)) * 100)}%</span>
              </div>
              <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-purple-500 to-amber-400 transition-all duration-500"
                  style={{ width: `${(completedCount / (paths.length || 1)) * 100}%` }} />
              </div>
            </div>

            {/* Path list */}
            <div className="space-y-1.5 mb-6 text-left max-w-sm mx-auto">
              {paths.map((p: any) => {
                const done = progress.find((pr: any) => pr.path_id === p.id && pr.completed);
                return (
                  <div key={p.id} className="flex items-center gap-2 text-xs">
                    <span className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                      done ? 'bg-green-500/20 text-green-400' : 'bg-slate-800 text-slate-600'
                    }`}>
                      {done ? '✓' : String.fromCharCode(65 + paths.indexOf(p))}
                    </span>
                    <span className={done ? 'text-green-400' : 'text-slate-500'}>
                      {p.title}
                    </span>
                  </div>
                );
              })}
            </div>

            {!user ? (
              <button onClick={showAuthModal}
                className="px-5 py-2 rounded-xl bg-purple-500/10 text-sm text-purple-300 border border-purple-500/20 hover:bg-purple-500/20 transition-all">
                Sign In to Track Progress
              </button>
            ) : completedCount === paths.length ? (
              <button onClick={generateCertificate} disabled={generating}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-purple-500 text-sm text-white font-medium hover:shadow-lg hover:shadow-amber-500/20 disabled:opacity-50 transition-all">
                {generating ? 'Generating...' : 'Generate Your Certificate'}
              </button>
            ) : (
              <Link href="/learn"
                className="inline-block px-5 py-2 rounded-xl bg-purple-500/10 text-sm text-purple-300 border border-purple-500/20 hover:bg-purple-500/20 transition-all">
                Continue Learning
              </Link>
            )}

            {message && <p className="text-xs text-red-400 mt-3">{message}</p>}
          </div>
        </div>
      )}
    </div>
  );
}
