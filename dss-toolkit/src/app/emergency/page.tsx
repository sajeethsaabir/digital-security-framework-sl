import { getEmergencyContacts } from '@/lib/db';

export default async function EmergencyPage() {
  const contacts = await getEmergencyContacts();

  const categories = [...new Set(contacts.map((c: any) => c.category))];

  return (
    <div className="max-w-3xl mx-auto">
      {/* Hero */}
      <div className="relative mb-10 p-6 lg:p-8 rounded-2xl overflow-hidden border border-red-500/20 bg-gradient-to-br from-red-500/10 via-red-900/10 to-red-500/5">
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-red-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-orange-500/5 rounded-full blur-3xl" />

        <div className="relative">
          <div className="flex items-center gap-3 mb-3">
            <div className="emergency-ring w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
              <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div className="flex gap-2">
              <span className="px-2 py-0.5 rounded-full bg-red-500/10 text-[10px] font-mono text-red-400 border border-red-500/30">
                Section 6
              </span>
              <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[10px] font-mono text-slate-500 border border-slate-700">
                URGENT
              </span>
            </div>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold text-red-100 mb-2">
            Emergency Quick Reference
          </h1>
          <p className="text-sm text-slate-400 leading-relaxed max-w-xl">
            Save these numbers in your phone. If you&apos;re under attack, disconnect from the
            internet and call SLCERT immediately.
          </p>

          <div className="flex flex-wrap gap-2 mt-4">
            <a href="tel:+94112691691"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/30 text-sm text-red-300 hover:bg-red-500/20 hover:text-red-200 transition-all font-mono animate-pulse-glow">
              <span className="w-2 h-2 rounded-full bg-red-500" />
              +94 11 2 691 691
            </a>
            <a href="tel:119"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-slate-300 hover:bg-slate-700 transition-all font-mono">
              <span className="w-2 h-2 rounded-full bg-slate-500" />
              119 — Police
            </a>
          </div>
        </div>
      </div>

      {/* Quick action checklist */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-px flex-1 bg-gradient-to-r from-red-500/20 to-transparent" />
          <span className="text-[10px] font-mono text-red-400 uppercase tracking-widest">Quick Action</span>
          <div className="h-px flex-1 bg-gradient-to-l from-red-500/20 to-transparent" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { title: 'Being Hacked Now', items: ['Disconnect from internet', "Don't turn off device", 'Take photos', 'Call SLCERT'], color: 'red' },
            { title: 'Money Being Stolen', items: ['Call bank immediately', 'Request account freeze', 'Call police: 119 or 118', 'Document transactions'], color: 'orange' },
            { title: 'Clicked Suspicious Link', items: ["Disconnect from internet", "Don't enter passwords", 'Run antivirus scan', 'Change passwords from another device'], color: 'yellow' },
            { title: 'Phone Stolen', items: ['Call provider to block SIM', 'Use Find My Device', 'Change passwords', 'Report to police'], color: 'amber' },
          ].map((section, i) => (
            <div key={section.title}
              className="group relative p-4 rounded-xl bg-slate-800/30 border border-slate-700/50 hover:border-red-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-red-500/5"
              style={{ animationDelay: `${i * 100}ms` }}>
              <h3 className={`text-xs font-semibold mb-2 ${
                section.color === 'red' ? 'text-red-400' :
                section.color === 'orange' ? 'text-orange-400' :
                section.color === 'yellow' ? 'text-yellow-400' : 'text-amber-400'
              }`}>{section.title}</h3>
              <ul className="space-y-1.5">
                {section.items.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-xs text-slate-400 group-hover:text-slate-300 transition-colors">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-red-500/40 transition-colors shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Contact categories */}
      <div className="space-y-4 stagger-enter">
        {categories.map((category) => {
          const catContacts = contacts.filter((c: any) => c.category === category);
          const isUrgent = category.toLowerCase().includes('incident') || category.toLowerCase().includes('emergency');
          return (
            <div key={category} className="rounded-xl border border-slate-700/50 overflow-hidden">
              <div className={`px-4 py-3 border-b border-slate-700/50 flex items-center gap-2 ${
                isUrgent ? 'bg-red-500/10' : 'bg-slate-800/80'
              }`}>
                {isUrgent && <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />}
                <h2 className={`text-sm font-semibold ${isUrgent ? 'text-red-300' : 'text-slate-200'}`}>
                  {category}
                </h2>
                <span className="text-[10px] text-slate-600 ml-auto">{catContacts.length} contacts</span>
              </div>
              <div className="divide-y divide-slate-700/50">
                {catContacts.map((contact: any) => (
                  <div key={contact.id}
                    className="px-4 py-3.5 hover:bg-slate-800/30 transition-all duration-200 group">
                    <div className="flex items-center justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-medium text-slate-200 group-hover:text-cyan-200 transition-colors truncate">
                          {contact.name}
                        </h3>
                        {contact.description && (
                          <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{contact.description}</p>
                        )}
                      </div>
                      <div className="text-right shrink-0">
                        {contact.phone && (
                          <a href={`tel:${contact.phone.replace(/[^+\d]/g, '')}`}
                            className="block text-sm font-mono text-red-300 hover:text-red-200 transition-colors">
                            {contact.phone}
                          </a>
                        )}
                        {contact.email && (
                          <a href={`mailto:${contact.email}`}
                            className="block text-xs text-slate-400 hover:text-cyan-400 transition-colors mt-0.5">
                            {contact.email}
                          </a>
                        )}
                      </div>
                    </div>
                    {contact.website && (
                      <a href={contact.website} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 mt-1.5 text-xs text-cyan-500 hover:text-cyan-400 transition-colors">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        {contact.website}
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer note */}
      <div className="mt-10 p-4 rounded-xl bg-slate-800/20 border border-slate-700/30">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="text-sm text-slate-500 leading-relaxed">
              This is not legal advice. In case of immediate danger, always call 119 (police) first
              before contacting cybersecurity incident response teams.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
