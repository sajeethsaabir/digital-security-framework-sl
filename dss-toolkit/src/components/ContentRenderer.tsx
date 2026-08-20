'use client';

import { useState, useCallback } from 'react';
import { useAuth } from './AuthProvider';

const P = '/images/illustrations';
const contentImages: Record<string, string> = {
  'hacked': `${P}/hacker.jpg`,
  'hacker': `${P}/hacker.jpg`,
  'hacking': `${P}/hacker.jpg`,
  'breach': `${P}/hacker.jpg`,
  'unauthorized access': `${P}/hacker.jpg`,
  'attacker': `${P}/hacker.jpg`,
  'intrusion': `${P}/hacker.jpg`,
  'phish': `${P}/phishing.jpg`,
  'suspicious link': `${P}/phishing.jpg`,
  'suspicious email': `${P}/phishing.jpg`,
  'clicked a suspicious': `${P}/phishing.jpg`,
  'ransom': `${P}/ransomware.jpg`,
  'ransomware': `${P}/ransomware.jpg`,
  'pop-up': `${P}/ransomware.jpg`,
  'popup': `${P}/ransomware.jpg`,
  'password': `${P}/password.jpg`,
  'passwords': `${P}/password.jpg`,
  'credentials': `${P}/password.jpg`,
  'login': `${P}/password.jpg`,
  'backup': `${P}/backup.jpg`,
  'back up': `${P}/backup.jpg`,
  'restore': `${P}/backup.jpg`,
  'data loss': `${P}/backup.jpg`,
  'bank': `${P}/bank.jpg`,
  'bank account': `${P}/bank.jpg`,
  'money was stolen': `${P}/bank.jpg`,
  'unauthorized transactions': `${P}/bank.jpg`,
  'financial': `${P}/bank.jpg`,
  'credit card': `${P}/bank.jpg`,
  'mobile': `${P}/phone.jpg`,
  'phone was': `${P}/phone.jpg`,
  'phone compromised': `${P}/phone.jpg`,
  'sim swap': `${P}/phone.jpg`,
  'airplane mode': `${P}/phone.jpg`,
  'smartphone': `${P}/phone.jpg`,
  'sms': `${P}/phone.jpg`,
  'text message': `${P}/phone.jpg`,
  'internet': `${P}/no-internet.jpg`,
  'wifi': `${P}/no-internet.jpg`,
  'wi-fi': `${P}/no-internet.jpg`,
  'disconnect': `${P}/no-internet.jpg`,
  'ethernet': `${P}/no-internet.jpg`,
  'antivirus': `${P}/antivirus.jpg`,
  'malware scan': `${P}/antivirus.jpg`,
  'slow': `${P}/slow-computer.jpg`,
  'freezing': `${P}/slow-computer.jpg`,
  'two-factor': `${P}/two-factor.jpg`,
  '2fa': `${P}/two-factor.jpg`,
  'authentication': `${P}/two-factor.jpg`,
  'mfa': `${P}/two-factor.jpg`,
  'secure': `${P}/shield.jpg`,
  'security': `${P}/shield.jpg`,
  'protect': `${P}/shield.jpg`,
  'protection': `${P}/shield.jpg`,
  'prevent': `${P}/shield.jpg`,
  'prevention': `${P}/shield.jpg`,
  'scam': `${P}/scam.jpg`,
  'scams': `${P}/scam.jpg`,
  'fraud': `${P}/scam.jpg`,
  'fraudulent': `${P}/scam.jpg`,
  'deceptive': `${P}/scam.jpg`,
  'imposter': `${P}/scam.jpg`,
  'social engineering': `${P}/scam.jpg`,
  'child': `${P}/children.jpg`,
  'children': `${P}/children.jpg`,
  'kid': `${P}/children.jpg`,
  'minor': `${P}/children.jpg`,
  'teen': `${P}/children.jpg`,
  'family': `${P}/children.jpg`,
  'parent': `${P}/children.jpg`,
  'student': `${P}/children.jpg`,
  'school': `${P}/children.jpg`,
  'social media': `${P}/social-media.jpg`,
  'facebook': `${P}/social-media.jpg`,
  'instagram': `${P}/social-media.jpg`,
  'whatsapp': `${P}/social-media.jpg`,
  'telegram': `${P}/social-media.jpg`,
  'profile': `${P}/social-media.jpg`,
  'social network': `${P}/social-media.jpg`,
  'privacy': `${P}/privacy.jpg`,
  'digital footprint': `${P}/privacy.jpg`,
  'personal information': `${P}/privacy.jpg`,
  'personal data': `${P}/privacy.jpg`,
  'tracking': `${P}/privacy.jpg`,
  'shopping': `${P}/shopping.jpg`,
  'online shopping': `${P}/shopping.jpg`,
  'purchase': `${P}/shopping.jpg`,
  'e-commerce': `${P}/shopping.jpg`,
  'payment': `${P}/shopping.jpg`,
  'checkout': `${P}/shopping.jpg`,
  'network': `${P}/network.jpg`,
  'server': `${P}/network.jpg`,
  'firewall': `${P}/network.jpg`,
  'router': `${P}/network.jpg`,
  'vpn': `${P}/network.jpg`,
  'report': `${P}/report.jpg`,
  'reporting': `${P}/report.jpg`,
  'police': `${P}/report.jpg`,
  'authorities': `${P}/report.jpg`,
  'slcert': `${P}/report.jpg`,
  'complaint': `${P}/report.jpg`,
  'investigation': `${P}/report.jpg`,
  'evidence': `${P}/report.jpg`,
  'cybercrime': `${P}/report.jpg`,
  'legal': `${P}/report.jpg`,
  'emergency': `${P}/emergency.jpg`,
  'hotline': `${P}/emergency.jpg`,
  'urgent': `${P}/emergency.jpg`,
  'crisis': `${P}/emergency.jpg`,
  'immediate': `${P}/emergency.jpg`,
  'malware': `${P}/cyber.jpg`,
  'virus': `${P}/cyber.jpg`,
  'trojan': `${P}/cyber.jpg`,
  'spyware': `${P}/cyber.jpg`,
  'exploit': `${P}/cyber.jpg`,
  'vulnerability': `${P}/cyber.jpg`,
  'cyber': `${P}/cyber.jpg`,
  'cybersecurity': `${P}/cyber.jpg`,
  'threat': `${P}/cyber.jpg`,
};

interface ContentBlock {
  id: number;
  content_type: string;
  content: string;
  level: number;
}

function CheckIcon() {
  return (
    <svg className="w-3 h-3 text-current" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" className="checkbox-checked" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg className="w-3 h-3 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function WarningIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
    </svg>
  );
}

function TipIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  );
}

const accentStyles: Record<string, {
  text: string;
  textDim: string;
  bg: string;
  bgHover: string;
  border: string;
  borderHover: string;
  dot: string;
  dotHover: string;
  headingBar: string;
  headingText: string;
  subText: string;
  warnBg: string;
  warnBorder: string;
  warnText: string;
  warnIcon: string;
  checkBg: string;
  checkBorder: string;
  ping: string;
  gradient: string;
}> = {
  cyan: {
    text: 'text-cyan-400',
    textDim: 'text-cyan-300',
    bg: 'bg-cyan-500/10',
    bgHover: 'bg-cyan-500/5',
    border: 'border-cyan-500/20',
    borderHover: 'group-hover:border-cyan-500/30',
    dot: 'bg-cyan-500/60',
    dotHover: 'group-hover:bg-cyan-400',
    headingBar: 'bg-cyan-400/50',
    headingText: 'gradient-text',
    subText: 'text-cyan-300',
    warnBg: 'bg-amber-500/5',
    warnBorder: 'border-amber-500/15',
    warnText: 'text-amber-300/90',
    warnIcon: 'text-amber-400',
    checkBg: 'bg-cyan-500/20',
    checkBorder: 'border-cyan-400/60',
    ping: 'bg-cyan-400',
    gradient: 'gradient-text',
  },
  red: {
    text: 'text-red-400',
    textDim: 'text-red-300',
    bg: 'bg-red-500/10',
    bgHover: 'bg-red-500/5',
    border: 'border-red-500/20',
    borderHover: 'group-hover:border-red-500/30',
    dot: 'bg-red-500/60',
    dotHover: 'group-hover:bg-red-400',
    headingBar: 'bg-red-400/50',
    headingText: 'gradient-text-red',
    subText: 'text-red-300',
    warnBg: 'bg-red-500/5',
    warnBorder: 'border-red-500/15',
    warnText: 'text-red-300/90',
    warnIcon: 'text-red-400',
    checkBg: 'bg-red-500/20',
    checkBorder: 'border-red-400/60',
    ping: 'bg-red-400',
    gradient: 'gradient-text-red',
  },
  emerald: {
    text: 'text-emerald-400',
    textDim: 'text-emerald-300',
    bg: 'bg-emerald-500/10',
    bgHover: 'bg-emerald-500/5',
    border: 'border-emerald-500/20',
    borderHover: 'group-hover:border-emerald-500/30',
    dot: 'bg-emerald-500/60',
    dotHover: 'group-hover:bg-emerald-400',
    headingBar: 'bg-emerald-400/50',
    headingText: 'gradient-text-emerald',
    subText: 'text-emerald-300',
    warnBg: 'bg-amber-500/5',
    warnBorder: 'border-amber-500/15',
    warnText: 'text-amber-300/90',
    warnIcon: 'text-amber-400',
    checkBg: 'bg-emerald-500/20',
    checkBorder: 'border-emerald-400/60',
    ping: 'bg-emerald-400',
    gradient: 'gradient-text-emerald',
  },
  yellow: {
    text: 'text-yellow-400',
    textDim: 'text-yellow-300',
    bg: 'bg-yellow-500/10',
    bgHover: 'bg-yellow-500/5',
    border: 'border-yellow-500/20',
    borderHover: 'group-hover:border-yellow-500/30',
    dot: 'bg-yellow-500/60',
    dotHover: 'group-hover:bg-yellow-400',
    headingBar: 'bg-yellow-400/50',
    headingText: 'gradient-text-warm',
    subText: 'text-yellow-300',
    warnBg: 'bg-amber-500/5',
    warnBorder: 'border-amber-500/15',
    warnText: 'text-amber-300/90',
    warnIcon: 'text-amber-400',
    checkBg: 'bg-yellow-500/20',
    checkBorder: 'border-yellow-400/60',
    ping: 'bg-yellow-400',
    gradient: 'gradient-text-warm',
  },
  orange: {
    text: 'text-orange-400',
    textDim: 'text-orange-300',
    bg: 'bg-orange-500/10',
    bgHover: 'bg-orange-500/5',
    border: 'border-orange-500/20',
    borderHover: 'group-hover:border-orange-500/30',
    dot: 'bg-orange-500/60',
    dotHover: 'group-hover:bg-orange-400',
    headingBar: 'bg-orange-400/50',
    headingText: 'gradient-text-orange',
    subText: 'text-orange-300',
    warnBg: 'bg-amber-500/5',
    warnBorder: 'border-amber-500/15',
    warnText: 'text-amber-300/90',
    warnIcon: 'text-amber-400',
    checkBg: 'bg-orange-500/20',
    checkBorder: 'border-orange-400/60',
    ping: 'bg-orange-400',
    gradient: 'gradient-text-orange',
  },
};

function HeroBanner({ url, title, fullPage = false }: { url: string; title: string; fullPage?: boolean }) {
  return (
    <div className={`full-width-hero relative overflow-hidden my-8 sm:my-10 ${fullPage ? 'min-h-screen' : 'h-72 sm:h-96 lg:h-[28rem] xl:h-[36rem]'}`}>
      <img src={url} alt="" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/50 via-40% to-slate-900/10" />
      <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 lg:p-12 xl:p-16">
        <div className="mx-auto" style={{ maxWidth: '56rem' }}>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white leading-tight drop-shadow-lg">
            {title}
          </h2>
        </div>
      </div>
    </div>
  );
}

function SubHeroBanner({ url, title }: { url: string; title: string }) {
  return (
    <div className="relative overflow-hidden rounded-xl h-52 sm:h-64 lg:h-72 mb-5">
      <img src={url} alt="" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 lg:p-6">
        <h4 className="text-lg sm:text-xl lg:text-2xl font-bold text-white drop-shadow-md">
          {title}
        </h4>
      </div>
    </div>
  );
}

function CardImage({ url }: { url: string }) {
  return (
    <div className="h-56 sm:h-64 lg:h-72 overflow-hidden">
      <img src={url} alt="" className="w-full h-full object-cover" loading="lazy" />
    </div>
  );
}

export default function ContentRenderer({
  blocks,
  accentColor = 'cyan',
}: {
  blocks: ContentBlock[];
  accentColor?: string;
}) {
  const { user, showAuthModal } = useAuth();
  const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set());
  const [animatingItems, setAnimatingItems] = useState<Set<number>>(new Set());
  const s = accentStyles[accentColor] || accentStyles.cyan;

  const toggleChecklist = useCallback((blockId: number) => {
    if (!user) {
      showAuthModal();
      return;
    }

    setAnimatingItems((prev) => new Set(prev).add(blockId));
    setCheckedItems((prev) => {
      const next = new Set(prev);
      if (next.has(blockId)) {
        next.delete(blockId);
      } else {
        next.add(blockId);
      }
      return next;
    });

    const isChecked = !checkedItems.has(blockId);
    fetch('/api/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content_block_id: blockId, checked: isChecked }),
    }).catch(() => {});

    setTimeout(() => {
      setAnimatingItems((prev) => {
        const next = new Set(prev);
        next.delete(blockId);
        return next;
      });
    }, 400);
  }, [user, showAuthModal, checkedItems]);

  const findMatchingIllustration = useCallback((text: string): string | null => {
    const lower = text.toLowerCase();
    for (const [keyword, url] of Object.entries(contentImages)) {
      if (lower.includes(keyword)) return url;
    }
    return null;
  }, []);



  if (blocks.length === 0) {
    return (
      <div className="flex items-center gap-3 p-4 rounded-lg bg-slate-800/30 border border-slate-700/30 animate-fade-in">
        <InfoIcon />
        <p className="text-sm text-slate-500 italic">Content coming soon...</p>
      </div>
    );
  }

  return (
    <div className="space-y-5 sm:space-y-6">
      {blocks.map((block, idx) => {
        const animStyle = { animationDelay: `${idx * 60}ms` };
        switch (block.content_type) {
          case 'heading': {
            const headingImg = findMatchingIllustration(block.content);
              if (headingImg) {
              return (
                <div key={block.id} className="animate-fade-in" style={animStyle}>
                  <HeroBanner url={headingImg} title={block.content} fullPage />
                </div>
              );
            }
            return (
              <div key={block.id} className="mt-8 sm:mt-12 mb-6 sm:mb-8 animate-fade-in" style={animStyle}>
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className={`w-1 h-8 sm:h-10 rounded-full ${s.headingBar} mt-1.5 shrink-0`} />
                  <div className="flex-1 min-w-0">
                    <h3 className={`text-xl sm:text-2xl lg:text-3xl font-bold ${s.headingText} leading-tight`}>
                      {block.content}
                    </h3>
                  </div>
                </div>
              </div>
            );
          }
          case 'subheading': {
            const subImg = findMatchingIllustration(block.content);
            if (subImg) {
              return (
                <div key={block.id} className="mt-6 sm:mt-8 mb-4 sm:mb-5 animate-fade-in" style={animStyle}>
                  <SubHeroBanner url={subImg} title={block.content} />
                </div>
              );
            }
            return (
              <div key={block.id} className="mt-6 sm:mt-8 mb-4 sm:mb-5 animate-fade-in" style={animStyle}>
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className={`w-1 h-6 rounded-full ${s.headingBar} shrink-0`} />
                  <h4 className={`text-base sm:text-lg lg:text-xl font-semibold ${s.subText} flex-1`}>
                    {block.content}
                  </h4>
                </div>
              </div>
            );
          }
          case 'bullet':
            return (
              <div key={block.id} className="flex items-start gap-3 py-2 px-2 sm:px-3 -mx-2 rounded-lg hover:bg-slate-800/10 transition-colors animate-fade-in" style={animStyle}>
                <span className={`mt-2.5 w-2 h-2 rounded-full ${s.dot} shrink-0`} />
                <span className="text-sm sm:text-base text-slate-200 leading-relaxed flex-1">{block.content}</span>
              </div>
            );
          case 'numbered':
            return (
              <div key={block.id} className="flex items-start gap-3 sm:gap-4 py-2 px-2 sm:px-3 -mx-2 rounded-lg hover:bg-slate-800/10 transition-colors animate-fade-in" style={animStyle}>
                <span className={`mt-0.5 w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-slate-800/80 flex items-center justify-center text-xs sm:text-sm ${s.text} font-mono shrink-0 border border-slate-700/50`}>
                  {String(blocks.indexOf(block) + 1).padStart(2, '0')}
                </span>
                <span className="text-sm sm:text-base text-slate-200 leading-relaxed pt-1 flex-1">{block.content}</span>
              </div>
            );
          case 'checklist':
            return (
              <div
                key={block.id}
                className={`flex items-start gap-3 py-2 sm:py-3 px-2 sm:px-3 text-sm sm:text-base group cursor-pointer rounded-lg transition-all duration-200 animate-fade-in ${
                  checkedItems.has(block.id) ? 'text-slate-500' : 'text-slate-200'
                } ${!user ? 'hover:bg-slate-800/20' : ''}`}
                style={animStyle}
                onClick={() => toggleChecklist(block.id)}
                role="checkbox"
                aria-checked={checkedItems.has(block.id)}
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleChecklist(block.id); } }}
              >
                <span className={`mt-0.5 w-5 h-5 rounded-md border-2 shrink-0 flex items-center justify-center transition-all duration-200 ${
                  checkedItems.has(block.id)
                    ? `${s.checkBg} ${s.checkBorder}`
                    : `border-slate-600 ${s.borderHover} ${s.bgHover}`
                } ${s.text}`}>
                  {checkedItems.has(block.id) ? (
                    <CheckIcon />
                  ) : !user ? (
                    <LockIcon />
                  ) : animatingItems.has(block.id) ? (
                    <span className={`w-2 h-2 rounded-full ${s.ping} animate-ping`} />
                  ) : null}
                </span>
                <span className={`leading-relaxed flex-1 ${checkedItems.has(block.id) ? 'line-through decoration-slate-600' : ''}`}>
                  {block.content}
                </span>
                {!user && (
                  <span className="text-[10px] sm:text-xs text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-0.5 flex items-center gap-1">
                    <LockIcon /> Sign in
                  </span>
                )}
              </div>
            );
          case 'warning':
            return (
              <div key={block.id} className={`rounded-xl border ${s.warnBorder} ${s.warnBg} overflow-hidden animate-fade-in`} style={animStyle}>
                {findMatchingIllustration(block.content) && <CardImage url={findMatchingIllustration(block.content)!} />}
                <div className="flex items-start gap-3 sm:gap-4 p-4 sm:p-5">
                  <span className={`${s.warnIcon} mt-0.5 shrink-0`}><WarningIcon /></span>
                  <span className={`${s.warnText} text-sm sm:text-base leading-relaxed flex-1`}>{block.content}</span>
                </div>
              </div>
            );
          case 'tip':
            return (
              <div key={block.id} className={`rounded-xl border ${s.border} ${s.bg} overflow-hidden animate-fade-in`} style={animStyle}>
                {findMatchingIllustration(block.content) && <CardImage url={findMatchingIllustration(block.content)!} />}
                <div className="flex items-start gap-3 sm:gap-4 p-4 sm:p-5">
                  <span className={`${s.text} mt-0.5 shrink-0`}><TipIcon /></span>
                  <span className={`${s.textDim} text-sm sm:text-base leading-relaxed flex-1`}>{block.content}</span>
                </div>
              </div>
            );
          case 'text':
          default:
            if (!block.content) return null;
            const content = block.content;
            const isWarning = content.startsWith('⚠') || content.startsWith('!') || content.toLowerCase().includes('warning');
            const isTip = content.startsWith('💡') || content.toLowerCase().includes('tip') || content.toLowerCase().includes('remember');

            if (isWarning) {
              return (
                <div key={block.id} className={`rounded-xl border ${s.warnBorder} ${s.warnBg} overflow-hidden animate-fade-in`} style={animStyle}>
                  {findMatchingIllustration(content) && <CardImage url={findMatchingIllustration(content)!} />}
                  <div className="flex items-start gap-3 sm:gap-4 p-4 sm:p-5">
                    <span className={`${s.warnIcon} mt-0.5 shrink-0`}><WarningIcon /></span>
                    <span className={`${s.warnText} text-sm sm:text-base leading-relaxed flex-1`}>{content.replace(/^[⚠!]\s*/, '')}</span>
                  </div>
                </div>
              );
            }

            if (isTip) {
              return (
                <div key={block.id} className={`rounded-xl border ${s.border} ${s.bg} overflow-hidden animate-fade-in`} style={animStyle}>
                  {findMatchingIllustration(content) && <CardImage url={findMatchingIllustration(content)!} />}
                  <div className="flex items-start gap-3 sm:gap-4 p-4 sm:p-5">
                    <span className={`${s.text} mt-0.5 shrink-0`}><TipIcon /></span>
                    <span className={`${s.textDim} text-sm sm:text-base leading-relaxed flex-1`}>{content.replace(/^[💡]\s*/, '')}</span>
                  </div>
                </div>
              );
            }

            const textImgUrl = findMatchingIllustration(content);
            if (textImgUrl) {
              return (
                <div key={block.id} className="rounded-xl bg-slate-800/20 border border-slate-700/10 overflow-hidden animate-fade-in card-shine" style={animStyle}>
                  <CardImage url={textImgUrl} />
                  <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-4 sm:pt-5">
                    <p className="text-sm sm:text-base text-slate-200 leading-relaxed">{content}</p>
                  </div>
                </div>
              );
            }
            return (
              <div key={block.id} className="py-1 animate-fade-in" style={animStyle}>
                <p className="text-sm sm:text-base text-slate-200 leading-relaxed">{content}</p>
              </div>
            );
        }
      })}
    </div>
  );
}
