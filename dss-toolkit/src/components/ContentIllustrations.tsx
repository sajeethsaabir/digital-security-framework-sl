function IllustrationFrame({ url, label }: { url: string; label?: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5 py-1">
      <div className="w-full max-w-[200px] mx-auto rounded-lg overflow-hidden border border-slate-700/30">
        <img
          src={url}
          alt={label || ''}
          className="w-full h-auto object-cover aspect-[3/2]"
          loading="lazy"
        />
      </div>
      {label && <span className="text-[10px] text-slate-600 text-center">{label}</span>}
    </div>
  );
}

const U = 'https://images.unsplash.com';

export const illustrationImages: Record<string, string> = {
  'slow': `${U}/photo-1517694712202-14dd9538aa97?w=400&h=267&fit=crop&auto=format`,
  'freezing': `${U}/photo-1517694712202-14dd9538aa97?w=400&h=267&fit=crop&auto=format`,
  'pop-up': `${U}/photo-1550751827-4bd374c3f58b?w=400&h=267&fit=crop&auto=format`,
  'popup': `${U}/photo-1550751827-4bd374c3f58b?w=400&h=267&fit=crop&auto=format`,
  'ransom': `${U}/photo-1550751827-4bd374c3f58b?w=400&h=267&fit=crop&auto=format`,
  'ransomware': `${U}/photo-1550751827-4bd374c3f58b?w=400&h=267&fit=crop&auto=format`,
  'antivirus': `${U}/photo-1555949963-ff9fe0c870eb?w=400&h=267&fit=crop&auto=format`,
  'disabled': `${U}/photo-1555949963-ff9fe0c870eb?w=400&h=267&fit=crop&auto=format`,
  'phish': `${U}/photo-1633265486064-086b219458ec?w=400&h=267&fit=crop&auto=format`,
  'suspicious link': `${U}/photo-1633265486064-086b219458ec?w=400&h=267&fit=crop&auto=format`,
  'clicked a suspicious': `${U}/photo-1633265486064-086b219458ec?w=400&h=267&fit=crop&auto=format`,
  'password': `${U}/photo-1555949963-aa79dcee981c?w=400&h=267&fit=crop&auto=format`,
  'passwords': `${U}/photo-1555949963-aa79dcee981c?w=400&h=267&fit=crop&auto=format`,
  'two-factor': `${U}/photo-1512941937669-90a1b58e7e9c?w=400&h=267&fit=crop&auto=format`,
  '2fa': `${U}/photo-1512941937669-90a1b58e7e9c?w=400&h=267&fit=crop&auto=format`,
  'authentication': `${U}/photo-1512941937669-90a1b58e7e9c?w=400&h=267&fit=crop&auto=format`,
  'backup': `${U}/photo-1460925895917-afdab827c52f?w=400&h=267&fit=crop&auto=format`,
  'back up': `${U}/photo-1460925895917-afdab827c52f?w=400&h=267&fit=crop&auto=format`,
  'disconnect': `${U}/photo-1558494949-ef010cbdcc31?w=400&h=267&fit=crop&auto=format`,
  'internet': `${U}/photo-1558494949-ef010cbdcc31?w=400&h=267&fit=crop&auto=format`,
  'wi-fi': `${U}/photo-1558494949-ef010cbdcc31?w=400&h=267&fit=crop&auto=format`,
  'wifi': `${U}/photo-1558494949-ef010cbdcc31?w=400&h=267&fit=crop&auto=format`,
  'ethernet': `${U}/photo-1558494949-ef010cbdcc31?w=400&h=267&fit=crop&auto=format`,
  'phone was': `${U}/photo-1511707171634-5f897ff02aa9?w=400&h=267&fit=crop&auto=format`,
  'phone compromised': `${U}/photo-1511707171634-5f897ff02aa9?w=400&h=267&fit=crop&auto=format`,
  'mobile': `${U}/photo-1511707171634-5f897ff02aa9?w=400&h=267&fit=crop&auto=format`,
  'sim swap': `${U}/photo-1511707171634-5f897ff02aa9?w=400&h=267&fit=crop&auto=format`,
  'airplane mode': `${U}/photo-1511707171634-5f897ff02aa9?w=400&h=267&fit=crop&auto=format`,
  'bank': `${U}/photo-1567427017947-545c5f8d16ad?w=400&h=267&fit=crop&auto=format`,
  'money was stolen': `${U}/photo-1567427017947-545c5f8d16ad?w=400&h=267&fit=crop&auto=format`,
  'bank account': `${U}/photo-1567427017947-545c5f8d16ad?w=400&h=267&fit=crop&auto=format`,
  'unauthorized transactions': `${U}/photo-1567427017947-545c5f8d16ad?w=400&h=267&fit=crop&auto=format`,
  'financial': `${U}/photo-1567427017947-545c5f8d16ad?w=400&h=267&fit=crop&auto=format`,
  'protect': `${U}/photo-1563013544-824ae1b704d3?w=400&h=267&fit=crop&auto=format`,
  'secure': `${U}/photo-1563013544-824ae1b704d3?w=400&h=267&fit=crop&auto=format`,
  'security': `${U}/photo-1563013544-824ae1b704d3?w=400&h=267&fit=crop&auto=format`,
};

export function ContentIllustration({ keyword }: { keyword: string }) {
  const url = illustrationImages[keyword];
  if (!url) return null;
  return <IllustrationFrame url={url} label={keyword} />;
}

export const contentIllustrations: Record<string, string> = illustrationImages;
