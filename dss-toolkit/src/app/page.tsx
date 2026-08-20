import Link from 'next/link';
import { getSections } from '@/lib/db';
import { sectionGraphics, sectionColors } from '@/components/SectionGraphics';

function ShieldIcon() {
  return (
    <svg viewBox="0 0 80 80" className="w-full h-full" fill="none">
      <defs>
        <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#22d3ee" />
        </linearGradient>
        <linearGradient id="shieldGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.1" />
        </linearGradient>
      </defs>
      {/* Outer ring */}
      <circle cx="40" cy="40" r="38" stroke="url(#shieldGrad2)" strokeWidth="2" className="animate-spin-slow" />
      <circle cx="40" cy="40" r="30" stroke="url(#shieldGrad2)" strokeWidth="1" className="animate-spin-slow" style={{ animationDirection: 'reverse', animationDuration: '12s' }} />
      {/* Shield */}
      <path d="M40 16L18 27v17c0 12.7 9.4 24.5 22 27 12.6-2.5 22-14.3 22-27V27L40 16z" stroke="url(#shieldGrad)" strokeWidth="2" fill="url(#shieldGrad2)" />
      {/* Checkmark */}
      <path d="M32 40l6 6 10-12" stroke="url(#shieldGrad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* Decorative dots */}
      <circle cx="22" cy="22" r="1.5" fill="#38bdf8" opacity="0.4" className="animate-float" style={{ animationDelay: '0s' }} />
      <circle cx="58" cy="24" r="1.5" fill="#22d3ee" opacity="0.4" className="animate-float" style={{ animationDelay: '1s' }} />
      <circle cx="25" cy="54" r="1" fill="#38bdf8" opacity="0.3" className="animate-float" style={{ animationDelay: '0.5s' }} />
      <circle cx="55" cy="52" r="1" fill="#22d3ee" opacity="0.3" className="animate-float" style={{ animationDelay: '1.5s' }} />
    </svg>
  );
}

function SectionCardPreview({ num }: { num: string }) {
  const Graphic = sectionGraphics[num] || sectionGraphics[''];
  const color = sectionColors[num] || sectionColors[''];
  return (
    <div className="w-12 h-12 lg:w-14 lg:h-14 shrink-0">
      <Graphic color={color} />
    </div>
  );
}

export default async function Home() {
  const sections = await getSections();

  return (
    <div className="max-w-4xl mx-auto">
      {/* Hero Section */}
      <div className="relative mb-12 overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800/50 via-slate-900/50 to-slate-800/50 border border-slate-700/50 p-8 lg:p-10">
        {/* Decorative background blobs */}
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-cyan-500/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-cyan-400/3 rounded-full blur-3xl" />

        <div className="relative flex items-start gap-6 lg:gap-10">
          <div className="hidden sm:block w-24 h-24 lg:w-28 lg:h-28 shrink-0">
            <div className="animate-float">
              <ShieldIcon />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-[10px] font-mono text-cyan-400 border border-cyan-500/20">
                v1.0
              </span>
              <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[10px] font-mono text-slate-500 border border-slate-700">
                Sri Lanka
              </span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold mb-2">
              <span className="gradient-text">Security Toolkit</span>
            </h1>
            <p className="text-sm lg:text-base text-slate-400 leading-relaxed max-w-2xl">
              Your comprehensive guide to staying safe online. Learn to protect your data,
              recognize threats, respond to attacks, and build lasting security habits.
            </p>
            <div className="flex flex-wrap gap-2 mt-4">
              {['No technical expertise needed', 'Practical step-by-step guides', 'Sri Lanka focused'].map((tag) => (
                <span key={tag} className="px-2.5 py-1 rounded-full bg-slate-800 text-xs text-slate-400 border border-slate-700/50">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Feature grid */}
        <div className="relative grid grid-cols-2 sm:grid-cols-3 gap-2 mt-6 pt-6 border-t border-slate-700/30">
          {[
            { label: 'Respond to attacks', icon: '🚨' },
            { label: 'Protect your data', icon: '🔒' },
            { label: 'Prevent threats', icon: '🛡️' },
            { label: 'Report incidents', icon: '📋' },
            { label: 'Build habits', icon: '✅' },
            { label: 'Stay informed', icon: '📡' },
          ].map((item, i) => (
            <div key={item.label} className="flex items-center gap-2 text-xs text-slate-500 group">
              <span className="text-base group-hover:scale-110 transition-transform">{item.icon}</span>
              <span className="group-hover:text-slate-300 transition-colors">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Section Cards */}
      <div className="space-y-3 stagger-enter">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-px flex-1 bg-gradient-to-r from-slate-700/50 to-transparent" />
          <span className="text-xs font-mono text-slate-600 uppercase tracking-widest">Explore the toolkit</span>
          <div className="h-px flex-1 bg-gradient-to-l from-slate-700/50 to-transparent" />
        </div>

        {sections.map((section) => {
          const num = section.section_number;
          const href = num === '6' ? '/emergency' : `/sections/${section.id}`;
          const isEmergency = num === '6';
          const colors = isEmergency
            ? 'border-red-500/30 hover:border-red-400/50 from-red-500/5 to-transparent'
            : 'border-slate-700/50 hover:border-cyan-500/30 from-cyan-500/5 to-transparent';

          return (
            <Link key={section.id} href={href} className="block group card-shine">
              <div className={`relative flex items-center gap-4 p-4 lg:p-5 rounded-xl bg-slate-800/30 border transition-all duration-300 ${colors}`}>
                {isEmergency && (
                  <span className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full bg-red-500/10 text-[10px] font-mono text-red-400 border border-red-500/30">
                    URGENT
                  </span>
                )}

                {/* Section scene preview */}
                <div className={`rounded-xl shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg overflow-hidden ${
                  isEmergency
                    ? 'bg-red-500/10 group-hover:shadow-red-500/20'
                    : 'bg-cyan-500/10 group-hover:shadow-cyan-500/20'
                }`}>
                  <SectionCardPreview num={num} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={`text-[10px] font-mono uppercase tracking-wider ${
                      isEmergency ? 'text-red-400' : 'text-cyan-500'
                    }`}>
                      {num ? `Section ${num}` : 'Overview'}
                    </span>
                  </div>
                  <h3 className={`text-sm lg:text-base font-semibold transition-colors truncate ${
                    isEmergency
                      ? 'text-red-200 group-hover:text-red-100'
                      : 'text-slate-200 group-hover:text-cyan-200'
                  }`}>
                    {section.title}
                  </h3>
                </div>

                <svg className={`w-5 h-5 shrink-0 transition-all duration-300 group-hover:translate-x-1 ${
                  isEmergency ? 'text-red-400' : 'text-slate-600 group-hover:text-cyan-400'
                }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Emergency Alert */}
      <div className="relative mt-10 p-5 lg:p-6 rounded-xl overflow-hidden border border-red-500/20 bg-gradient-to-r from-red-500/5 via-red-500/3 to-transparent">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right, rgba(239,68,68,0.08), transparent_60%)]" />
        <div className="relative flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center shrink-0 animate-pulse-glow">
            <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-red-300 mb-1">Under attack right now?</h3>
            <p className="text-xs text-slate-400 mb-3 leading-relaxed">
              Don&apos;t panic. Disconnect from the internet and call SLCERT immediately.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/emergency" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 text-xs text-red-300 hover:bg-red-500/20 border border-red-500/20 transition-all">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                View Emergency Contacts
              </Link>
              <a href="tel:+94112691691" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 text-xs text-slate-300 hover:bg-slate-700 border border-slate-700 transition-all font-mono">
                +94 11 2 691 691
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
