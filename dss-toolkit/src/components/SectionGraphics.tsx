function ShieldBook({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 160 160" className="w-full h-full">
      <defs>
        <radialGradient id="s1g" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
        <linearGradient id="s1b" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.4" />
          <stop offset="100%" stopColor={color} stopOpacity="0.1" />
        </linearGradient>
      </defs>
      <circle cx="80" cy="80" r="75" fill="url(#s1g)" />
      <circle cx="80" cy="80" r="65" stroke={color} strokeWidth="0.5" strokeDasharray="3 5" opacity="0.2" fill="none" />
      {/* Book base */}
      <rect x="48" y="45" width="64" height="50" rx="4" fill="url(#s1b)" stroke={color} strokeWidth="1.5" opacity="0.6" />
      <rect x="48" y="45" width="64" height="50" rx="4" fill={color} fillOpacity="0.06" />
      {/* Pages */}
      <rect x="52" y="48" width="56" height="44" rx="2" fill={color} fillOpacity="0.04" />
      <line x1="56" y1="56" x2="98" y2="56" stroke={color} strokeWidth="0.8" opacity="0.3" />
      <line x1="56" y1="62" x2="95" y2="62" stroke={color} strokeWidth="0.8" opacity="0.25" />
      <line x1="56" y1="68" x2="92" y2="68" stroke={color} strokeWidth="0.8" opacity="0.2" />
      <line x1="56" y1="74" x2="88" y2="74" stroke={color} strokeWidth="0.8" opacity="0.15" />
      {/* Shield on book */}
      <path d="M80 28l-18 8v18c0 12 8 23 18 26 10-3 18-14 18-26V36l-18-8z" fill={color} fillOpacity="0.12" stroke={color} strokeWidth="1.5" />
      <path d="M75 48l4 4 7-8" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      {/* Floating dots */}
      <circle cx="35" cy="40" r="2" fill={color} opacity="0.3" className="animate-float" style={{ animationDelay: '0s' }} />
      <circle cx="125" cy="50" r="1.5" fill={color} opacity="0.25" className="animate-float" style={{ animationDelay: '1s' }} />
      <circle cx="30" cy="100" r="1.5" fill={color} opacity="0.2" className="animate-float" style={{ animationDelay: '0.5s' }} />
      <circle cx="130" cy="90" r="2" fill={color} opacity="0.3" className="animate-float" style={{ animationDelay: '1.5s' }} />
    </svg>
  );
}

function AttackAlert({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 160 160" className="w-full h-full">
      <defs>
        <radialGradient id="s2g" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
        <linearGradient id="s2b" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.4" />
          <stop offset="100%" stopColor={color} stopOpacity="0.1" />
        </linearGradient>
      </defs>
      <circle cx="80" cy="80" r="75" fill="url(#s2g)" />
      <circle cx="80" cy="80" r="60" stroke={color} strokeWidth="0.5" strokeDasharray="4 6" opacity="0.2" fill="none" className="animate-spin-slow" />
      {/* Shield blocking attack */}
      <path d="M80 32l-24 12v25c0 18 12 34 24 38 12-4 24-20 24-38V44L80 32z" fill={color} fillOpacity="0.08" stroke={color} strokeWidth="1.5" />
      <path d="M76 50l8 8m0-8l-8 8" stroke={color} strokeWidth="2.5" strokeLinecap="round" opacity="0.9" />
      {/* Lightning bolts */}
      <path d="M40 45l12-4-4 16 10-3-6 18" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.5" />
      <path d="M120 55l-10 4 4-14-8 3 5-15" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.4" />
      {/* Exclamation dots */}
      <circle cx="45" cy="85" r="3" fill={color} opacity="0.3" className="animate-ping" style={{ animationDuration: '2s' }} />
      {/* Alert lines */}
      <path d="M130 38l-8 8M130 46l-8-8" stroke={color} strokeWidth="1.2" strokeLinecap="round" opacity="0.3" />
      {/* Attack code fragments */}
      <text x="38" y="110" fontSize="6" fill={color} opacity="0.15" fontFamily="monospace" transform="rotate(-15, 38, 110)">0x7F 0xE5</text>
      <text x="100" y="120" fontSize="6" fill={color} opacity="0.12" fontFamily="monospace" transform="rotate(10, 100, 120)">0xFF 0x01</text>
    </svg>
  );
}

function DataLock({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 160 160" className="w-full h-full">
      <defs>
        <radialGradient id="s3g" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
        <linearGradient id="s3b" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.4" />
          <stop offset="100%" stopColor={color} stopOpacity="0.1" />
        </linearGradient>
      </defs>
      <circle cx="80" cy="80" r="75" fill="url(#s3g)" />
      {/* Data layers */}
      {[0, 1, 2].map((i) => (
        <rect key={i} x={42 + i * 3} y={58 + i * 14} width={62 - i * 6} height={16} rx={3}
          fill={color} fillOpacity={0.06 + i * 0.02}
          stroke={color} strokeWidth="0.8" opacity={0.5 - i * 0.1} />
      ))}
      {/* Lock on top */}
      <rect x="64" y="42" width="32" height="26" rx="6" fill={color} fillOpacity="0.1" stroke={color} strokeWidth="1.5" />
      <rect x="72" y="48" width="16" height="10" rx="3" fill={color} fillOpacity="0.06" />
      <path d="M72 48V36a8 8 0 0116 0v12" stroke={color} strokeWidth="1.5" fill="none" />
      <circle cx="80" cy="62" r="2" fill={color} opacity="0.6" />
      {/* Keyhole */}
      <circle cx="80" cy="60" r="3" fill={color} fillOpacity="0.15" />
      <rect x="78" y="60" width="4" height="4" rx="1" fill={color} fillOpacity="0.15" />
      {/* Data dots */}
      <circle cx="45" cy="95" r="1.5" fill={color} opacity="0.3" />
      <circle cx="60" cy="102" r="1" fill={color} opacity="0.2" />
      <circle cx="100" cy="95" r="1.5" fill={color} opacity="0.3" />
      <circle cx="115" cy="102" r="1" fill={color} opacity="0.2" />
    </svg>
  );
}

function PreventionShield({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 160 160" className="w-full h-full">
      <defs>
        <radialGradient id="s4g" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
        <linearGradient id="s4b" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.4" />
          <stop offset="100%" stopColor={color} stopOpacity="0.1" />
        </linearGradient>
      </defs>
      <circle cx="80" cy="80" r="75" fill="url(#s4g)" />
      <circle cx="80" cy="80" r="55" stroke={color} strokeWidth="0.5" strokeDasharray="2 4" opacity="0.2" fill="none" />
      {/* Shield */}
      <path d="M80 28l-24 14v28c0 20 12 38 24 44 12-6 24-24 24-44V42L80 28z" fill={color} fillOpacity="0.08" stroke={color} strokeWidth="1.5" />
      {/* Large checkmark */}
      <path d="M66 78l10 10 18-22" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      {/* Prevention tools around */}
      <circle cx="38" cy="50" r="8" fill={color} fillOpacity="0.06" stroke={color} strokeWidth="0.8" opacity="0.4" />
      <path d="M34 50l4-4M38 46l4 4" stroke={color} strokeWidth="1" opacity="0.3" strokeLinecap="round" />
      <circle cx="122" cy="52" r="8" fill={color} fillOpacity="0.06" stroke={color} strokeWidth="0.8" opacity="0.4" />
      <rect x="119" y="49" width="6" height="6" rx="1" stroke={color} strokeWidth="0.8" opacity="0.3" fill="none" />
      {/* Shield edges glow */}
      <circle cx="40" cy="110" r="2" fill={color} opacity="0.25" />
      <circle cx="120" cy="108" r="2" fill={color} opacity="0.25" />
      <circle cx="80" cy="125" r="2" fill={color} opacity="0.2" />
    </svg>
  );
}

function BestPractices({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 160 160" className="w-full h-full">
      <defs>
        <radialGradient id="s5g" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="80" cy="80" r="75" fill="url(#s5g)" />
      {/* Star */}
      <path d="M80 30l10 20 22-4-14 18 16 16-22 4 8 22-20-12-20 12 8-22-22-4 16-16-14-18 22 4z"
        fill={color} fillOpacity="0.08" stroke={color} strokeWidth="1.2" />
      {/* Inner glow */}
      <path d="M80 42l7 14 16-3-10 13 11 11-15 3 5 15-14-8-14 8 5-15-15-3 11-11-10-13 16 3z"
        fill={color} fillOpacity="0.04" stroke={color} strokeWidth="0.6" opacity="0.5" />
      {/* Check marks around */}
      <path d="M38 70l4 4 7-8" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.5" />
      <path d="M115 70l4 4 7-8" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.5" />
      <path d="M76 112l3 3 6-7" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.4" />
      {/* Sparkle dots */}
      <circle cx="50" cy="40" r="1.5" fill={color} opacity="0.3" />
      <circle cx="110" cy="38" r="1.5" fill={color} opacity="0.3" />
      <circle cx="40" cy="95" r="1" fill={color} opacity="0.2" />
      <circle cx="120" cy="93" r="1" fill={color} opacity="0.2" />
    </svg>
  );
}

function ReportScene({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 160 160" className="w-full h-full">
      <defs>
        <radialGradient id="s6g" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
        <linearGradient id="s6b" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.4" />
          <stop offset="100%" stopColor={color} stopOpacity="0.1" />
        </linearGradient>
      </defs>
      <circle cx="80" cy="80" r="75" fill="url(#s6g)" />
      {/* Report document */}
      <rect x="46" y="36" width="50" height="64" rx="4" fill={color} fillOpacity="0.06" stroke={color} strokeWidth="1.2" />
      <rect x="46" y="36" width="50" height="10" rx="4" fill={color} fillOpacity="0.08" />
      <line x1="52" y1="54" x2="80" y2="54" stroke={color} strokeWidth="0.6" opacity="0.3" />
      <line x1="52" y1="60" x2="85" y2="60" stroke={color} strokeWidth="0.6" opacity="0.25" />
      <line x1="52" y1="66" x2="78" y2="66" stroke={color} strokeWidth="0.6" opacity="0.2" />
      <line x1="52" y1="72" x2="82" y2="72" stroke={color} strokeWidth="0.6" opacity="0.15" />
      <line x1="52" y1="78" x2="75" y2="78" stroke={color} strokeWidth="0.6" opacity="0.12" />
      {/* Megaphone */}
      <path d="M106 52l-24 8v32l24 8V52z" fill={color} fillOpacity="0.08" stroke={color} strokeWidth="1.2" />
      <path d="M82 60l-12-6v24l12-6" fill={color} fillOpacity="0.04" stroke={color} strokeWidth="1" />
      {/* Sound waves */}
      <path d="M118 58q10 8 0 16" stroke={color} strokeWidth="1" fill="none" opacity="0.4" />
      <path d="M124 52q14 12 0 24" stroke={color} strokeWidth="0.8" fill="none" opacity="0.25" />
      {/* Exclamation */}
      <circle cx="112" cy="86" r="3" fill={color} opacity="0.3" />
      <path d="M112 90v-6" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
    </svg>
  );
}

function EmergencySiren({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 160 160" className="w-full h-full">
      <defs>
        <radialGradient id="s7g" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="80" cy="80" r="75" fill="url(#s7g)" />
      <circle cx="80" cy="80" r="60" stroke={color} strokeWidth="0.5" strokeDasharray="6 4" opacity="0.2" fill="none" className="animate-spin-slow" style={{ animationDirection: 'reverse' }} />
      {/* Siren light */}
      <circle cx="80" cy="36" r="10" fill={color} fillOpacity="0.15" stroke={color} strokeWidth="1.5" />
      <circle cx="80" cy="36" r="5" fill={color} fillOpacity="0.2" className="animate-ping" style={{ animationDuration: '1s' }} />
      {/* Siren base */}
      <rect x="64" y="42" width="32" height="12" rx="3" fill={color} fillOpacity="0.08" stroke={color} strokeWidth="1" />
      {/* Alert triangle */}
      <path d="M80 58L50 116h60z" fill={color} fillOpacity="0.06" stroke={color} strokeWidth="1.2" />
      <path d="M80 72v20m0 6v2" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.7" />
      {/* Phone icon */}
      <rect x="68" y="108" width="24" height="16" rx="4" fill={color} fillOpacity="0.06" stroke={color} strokeWidth="0.8" />
      <path d="M72 112l4-4 4 4M76 108v8" stroke={color} strokeWidth="0.8" opacity="0.4" />
      {/* Emergency cross */}
      <path d="M38 70l-4-4M34 66l4 4" stroke={color} strokeWidth="1.2" opacity="0.3" strokeLinecap="round" />
      <path d="M126 72l-4-4M122 68l4 4" stroke={color} strokeWidth="1.2" opacity="0.3" strokeLinecap="round" />
    </svg>
  );
}

export const sectionGraphics = {
  '': ShieldBook,
  '1': AttackAlert,
  '2': DataLock,
  '3': PreventionShield,
  '4': BestPractices,
  '5': ReportScene,
  '6': EmergencySiren,
} as Record<string, React.ComponentType<{ color: string }>>;

export const sectionColors: Record<string, string> = {
  '': '#38bdf8',
  '1': '#ef4444',
  '2': '#22d3ee',
  '3': '#2dd4bf',
  '4': '#facc15',
  '5': '#fb923c',
  '6': '#ef4444',
};

export const sectionTheme: Record<string, {
  border: string;
  bg: string;
  badge: string;
  accent: string;
  icon: string;
}> = {
  '': {
    border: 'border-cyan-500/20 hover:border-cyan-400/40',
    bg: 'from-cyan-500/5 to-transparent',
    badge: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    accent: 'text-cyan-400',
    icon: 'bg-cyan-500/10 text-cyan-400',
  },
  '1': {
    border: 'border-red-500/20 hover:border-red-400/40',
    bg: 'from-red-500/5 to-transparent',
    badge: 'bg-red-500/10 text-red-400 border-red-500/20',
    accent: 'text-red-400',
    icon: 'bg-red-500/10 text-red-400',
  },
  '2': {
    border: 'border-cyan-500/20 hover:border-cyan-400/40',
    bg: 'from-cyan-500/5 to-transparent',
    badge: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    accent: 'text-cyan-400',
    icon: 'bg-cyan-500/10 text-cyan-400',
  },
  '3': {
    border: 'border-emerald-500/20 hover:border-emerald-400/40',
    bg: 'from-emerald-500/5 to-transparent',
    badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    accent: 'text-emerald-400',
    icon: 'bg-emerald-500/10 text-emerald-400',
  },
  '4': {
    border: 'border-yellow-500/20 hover:border-yellow-400/40',
    bg: 'from-yellow-500/5 to-transparent',
    badge: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    accent: 'text-yellow-400',
    icon: 'bg-yellow-500/10 text-yellow-400',
  },
  '5': {
    border: 'border-orange-500/20 hover:border-orange-400/40',
    bg: 'from-orange-500/5 to-transparent',
    badge: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    accent: 'text-orange-400',
    icon: 'bg-orange-500/10 text-orange-400',
  },
  '6': {
    border: 'border-red-500/30 hover:border-red-400/50',
    bg: 'from-red-500/5 to-transparent',
    badge: 'bg-red-500/10 text-red-400 border-red-500/30',
    accent: 'text-red-400',
    icon: 'bg-red-500/10 text-red-400',
  },
};
