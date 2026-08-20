import { Pool } from 'pg';
import * as fs from 'fs';
import * as path from 'path';

const pool = new Pool({
  host: '/tmp/opencode',
  port: 5433,
  database: 'dss_toolkit',
  user: 'zuko',
});

function cleanText(text: string): string {
  return text.replace(/\*\*/g, '').replace(/__/g, '').trim();
}

function isAnchorLine(line: string): boolean {
  return line.trim().startsWith('<a ');
}

function isSectionHeading(line: string): boolean {
  return line.trim().startsWith('# ') && !line.trim().startsWith('## ');
}

function isSubsectionHeading(line: string): boolean {
  return line.trim().startsWith('## ') && !line.trim().startsWith('### ');
}

function isSubSubsectionHeading(line: string): boolean {
  return line.trim().startsWith('### ');
}

function isBullet(line: string): boolean {
  return line.trim().startsWith('- ');
}

function isNumbered(line: string): boolean {
  return /^\s*\d+[\.\)]\s/.test(line);
}

function isChecklist(line: string): boolean {
  return line.includes('□ ');
}

function isBoldHeading(line: string): boolean {
  return /^\*{2}.+?\*{2}/.test(line.trim());
}

function extractMainContent(line: string): string {
  let t = line.trim();
  t = t.replace(/<a\s+id="[^"]*"><\/a>/g, '').trim();
  t = t.replace(/^[-]\s*/, '').trim();
  t = t.replace(/^\d+[\.\)]\s*/, '').trim();
  t = t.replace(/^□\s*/, '').trim();
  t = t.replace(/^#+\s*/, '').trim();
  t = cleanText(t);
  return t;
}

async function seed() {
  const filePath = path.join(process.cwd(), '..', 'dss-toolkit-v1.0.md');
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Clear existing data
    await client.query('DELETE FROM content_blocks');
    await client.query('DELETE FROM subsections');
    await client.query('DELETE FROM sections');
    await client.query('DELETE FROM emergency_contacts');
    await client.query('DELETE FROM glossary_terms');
    await client.query('DELETE FROM resources');

    let currentSection: { id: number; number: string } | null = null;
    let currentSubsection: { id: number; number: string } | null = null;
    let blockOrder = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();

      if (!trimmed) continue;

      if (isSectionHeading(trimmed)) {
        const anchor = isAnchorLine(lines[i - 1]?.trim() || '')
          ? lines[i - 1].match(/id="([^"]+)"/)?.[1] || ''
          : '';
        let title = trimmed.replace(/^#\s*/, '');
        title = title.replace(/<a\s+id="[^"]*"><\/a>/g, '').trim();
        const numMatch = title.match(/^(\d+(?:\.\d+)*)\s*[\.\s]*(.+)/);
        const secNum = numMatch ? numMatch[1] : String(Math.ceil(Math.random() * 100));
        const secTitle = numMatch ? numMatch[2].trim() : title;

        const res = await client.query(
          `INSERT INTO sections (section_number, title, anchor_id, sort_order)
           VALUES ($1, $2, $3, $4) RETURNING id`,
          [secNum, secTitle, anchor, i]
        );
        currentSection = { id: res.rows[0].id, number: secNum };
        currentSubsection = null;
        blockOrder = 0;
        continue;
      }

      if (isSubsectionHeading(trimmed) && currentSection) {
        const anchor = isAnchorLine(lines[i - 1]?.trim() || '')
          ? lines[i - 1].match(/id="([^"]+)"/)?.[1] || ''
          : '';
        let title = trimmed.replace(/^##\s*/, '');
        title = title.replace(/<a\s+id="[^"]*"><\/a>/g, '').trim();
        const numMatch = title.match(/^(\d+\.\d+)\s+(.+)/);
        const subNum = numMatch ? numMatch[1] : '';
        const subTitle = numMatch ? numMatch[2].trim() : title;

        const res = await client.query(
          `INSERT INTO subsections (section_id, subsection_number, title, anchor_id, sort_order)
           VALUES ($1, $2, $3, $4, $5) RETURNING id`,
          [currentSection.id, subNum, subTitle, anchor, i]
        );
        currentSubsection = { id: res.rows[0].id, number: subNum };
        blockOrder = 0;
        continue;
      }

      if (isSubSubsectionHeading(trimmed) && currentSection && currentSubsection) {
        let title = trimmed.replace(/^###\s*/, '');
        title = title.replace(/<a\s+id="[^"]*"><\/a>/g, '').trim();
        const t = cleanText(title);
        if (t) {
          blockOrder++;
          await client.query(
            `INSERT INTO content_blocks (section_id, subsection_id, content_type, content, level, sort_order)
             VALUES ($1, $2, 'subheading', $3, 3, $4)`,
            [currentSection.id, currentSubsection.id, t, blockOrder]
          );
        }
        continue;
      }

      if (isSubSubsectionHeading(trimmed) && currentSection && !currentSubsection) {
        let title = trimmed.replace(/^###\s*/, '');
        title = title.replace(/<a\s+id="[^"]*"><\/a>/g, '').trim();
        const t = cleanText(title);
        if (t) {
          blockOrder++;
          await client.query(
            `INSERT INTO content_blocks (section_id, subsection_id, content_type, content, level, sort_order)
             VALUES ($1, NULL, 'subheading', $2, 3, $3)`,
            [currentSection.id, t, blockOrder]
          );
        }
        continue;
      }

      if (currentSection && currentSubsection) {
        let type = 'text';
        let content = trimmed;

        if (isChecklist(trimmed)) {
          type = 'checklist';
          content = extractMainContent(trimmed);
        } else if (isBullet(trimmed)) {
          type = 'bullet';
          content = extractMainContent(trimmed);
        } else if (isNumbered(trimmed)) {
          type = 'numbered';
          content = extractMainContent(trimmed);
        } else if (isBoldHeading(trimmed)) {
          type = 'heading';
          content = cleanText(trimmed);
        } else {
          content = cleanText(trimmed);
          if (!content) continue;
        }

        blockOrder++;
        await client.query(
          `INSERT INTO content_blocks (section_id, subsection_id, content_type, content, level, sort_order)
           VALUES ($1, $2, $3, $4, 1, $5)`,
          [currentSection.id, currentSubsection.id, type, content, blockOrder]
        );
      } else if (currentSection && !currentSubsection) {
        let type = 'text';
        let content = trimmed;

        if (isChecklist(trimmed)) {
          type = 'checklist';
          content = extractMainContent(trimmed);
        } else if (isBullet(trimmed)) {
          type = 'bullet';
          content = extractMainContent(trimmed);
        } else if (isNumbered(trimmed)) {
          type = 'numbered';
          content = extractMainContent(trimmed);
        } else if (isBoldHeading(trimmed)) {
          type = 'heading';
          content = cleanText(trimmed);
        } else {
          content = cleanText(trimmed);
          if (!content) continue;
        }

        blockOrder++;
        await client.query(
          `INSERT INTO content_blocks (section_id, subsection_id, content_type, content, level, sort_order)
           VALUES ($1, NULL, $2, $3, 0, $4)`,
          [currentSection.id, type, content, blockOrder]
        );
      }
    }

    // Seed emergency contacts from the markdown
    const contactsSection = lines.slice(3077, 3108);
    const emergencyContacts = [
      { category: 'Cybersecurity Emergency', name: 'SLCERT 24/7 Hotline', phone: '+94 11 2 691 691', email: 'incidents@cert.gov.lk', website: 'https://www.cert.gov.lk', desc: 'National cybersecurity incident response' },
      { category: 'Criminal Cyber Incident', name: 'Police Emergency', phone: '119 or 118', email: '', website: '', desc: 'Emergency police contact' },
      { category: 'Criminal Cyber Incident', name: 'CID Headquarters', phone: '011 2 691 500', email: '', website: '', desc: 'Criminal Investigation Department' },
      { category: 'Banking Fraud', name: 'Central Bank of Sri Lanka', phone: '+94 11 2 477 000', email: '', website: 'https://www.cbsl.gov.lk', desc: 'For banking fraud and financial complaints' },
      { category: 'Telecom Issues', name: 'TRCSL Hotline', phone: '2423', email: '', website: 'https://www.trc.gov.lk', desc: 'Telecom Regulatory Commission' },
      { category: 'Telecom Issues', name: 'TRCSL Office', phone: '+94 11 2 671 228', email: 'info@trc.gov.lk', website: '', desc: '' },
      { category: 'Consumer Complaints', name: 'CAA Hotline', phone: '1979', email: 'info@caa.gov.lk', website: 'https://www.caa.gov.lk', desc: 'Consumer Affairs Authority' },
    ];

    for (const c of emergencyContacts) {
      await client.query(
        `INSERT INTO emergency_contacts (category, name, phone, email, website, description, sort_order)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [c.category, c.name, c.phone, c.email, c.website, c.desc, 0]
      );
    }

    // Seed glossary
    const glossaryTerms = [
      { term: '2FA / Two-Factor Authentication', definition: 'Security method requiring two types of verification to access an account (like password + phone code).' },
      { term: 'Antivirus', definition: 'Software that detects and removes malicious software (viruses, malware).' },
      { term: 'Backup', definition: 'A copy of your data stored separately so you can recover it if lost.' },
      { term: 'Botnet', definition: 'Network of infected computers controlled by hackers.' },
      { term: 'Breach / Data Breach', definition: 'Incident where unauthorized person accesses protected data.' },
      { term: 'Cookie', definition: 'Small file websites store on your device to remember you and track activity.' },
      { term: 'DDoS (Distributed Denial of Service)', definition: 'Attack that overwhelms a website with traffic to make it unavailable.' },
      { term: 'Encryption', definition: 'Converting data into code that only authorized people can read.' },
      { term: 'Firewall', definition: 'Security system that blocks unauthorized access while allowing legitimate communication.' },
      { term: 'Hacking', definition: 'Unauthorized access to computer systems or data.' },
      { term: 'HTTPS', definition: 'Secure version of HTTP - encrypts communication between your browser and websites (look for padlock icon).' },
      { term: 'Identity Theft', definition: 'Crime where someone steals your personal information to impersonate you.' },
      { term: 'IP Address', definition: 'Unique numerical address that identifies your device on the internet.' },
      { term: 'Malware', definition: 'Malicious software designed to damage or gain unauthorized access (includes viruses, trojans, spyware, ransomware).' },
      { term: 'Phishing', definition: 'Fraudulent attempt to obtain sensitive information by pretending to be trustworthy.' },
      { term: 'Ransomware', definition: 'Malware that encrypts your files and demands payment to unlock them.' },
      { term: 'Social Engineering', definition: 'Manipulation technique to trick people into giving up confidential information.' },
      { term: 'Spam', definition: 'Unwanted, irrelevant, or inappropriate messages sent in bulk.' },
      { term: 'Spyware', definition: 'Software that secretly monitors your activities and collects information.' },
      { term: 'Trojan / Trojan Horse', definition: 'Malware disguised as legitimate software.' },
      { term: 'Virus', definition: 'Malware that spreads by copying itself to other programs or files.' },
      { term: 'VPN (Virtual Private Network)', definition: 'Service that creates encrypted connection over the internet for privacy and security.' },
      { term: 'Vulnerability', definition: 'Weakness in software or system that can be exploited by attackers.' },
      { term: 'Zero-Day', definition: 'Previously unknown vulnerability that hackers exploit before developers can fix it.' },
    ];

    for (const g of glossaryTerms) {
      await client.query(
        `INSERT INTO glossary_terms (term, definition) VALUES ($1, $2) ON CONFLICT (term) DO NOTHING`,
        [g.term, g.definition]
      );
    }

    // Seed resources
    const resources = [
      { category: 'Sri Lankan', name: 'SLCERT Website', url: 'https://www.cert.gov.lk', desc: 'Security advisories, incident reporting, security tips, training resources' },
      { category: 'Sri Lankan', name: 'ICTA Sri Lanka', url: 'https://www.icta.lk', desc: 'Digital literacy programs, ICT resources' },
      { category: 'International', name: 'Stay Safe Online', url: 'https://staysafeonline.org', desc: 'General cybersecurity tips' },
      { category: 'International', name: 'CISA Cybersecurity', url: 'https://www.cisa.gov/cybersecurity', desc: 'US cybersecurity resources' },
      { category: 'International', name: 'Get Safe Online', url: 'https://www.getsafeonline.org', desc: 'Practical security advice' },
      { category: 'International', name: 'Google Safety Center', url: 'https://safety.google', desc: 'Online safety tools and tips' },
      { category: 'Tools', name: 'Have I Been Pwned', url: 'https://haveibeenpwned.com', desc: 'Check if your email has been in a breach' },
      { category: 'Tools', name: 'Privacy Tools', url: 'https://www.privacytools.io', desc: 'Privacy-focused tools and services' },
      { category: 'Antivirus', name: 'Windows Defender', url: '', desc: 'Built into Windows' },
      { category: 'Antivirus', name: 'Malwarebytes', url: '', desc: 'Free version available' },
      { category: 'Password Manager', name: 'Bitwarden', url: '', desc: 'Free, open-source password manager' },
      { category: 'Password Manager', name: 'KeePassXC', url: '', desc: 'Free, offline password manager' },
      { category: 'VPN', name: 'ProtonVPN', url: '', desc: 'Has free tier with unlimited data' },
      { category: 'VPN', name: 'Windscribe', url: '', desc: 'Free tier with 10GB/month' },
      { category: 'Communication', name: 'Signal', url: '', desc: 'Free, most secure messaging app' },
      { category: 'Communication', name: 'ProtonMail', url: '', desc: 'Free encrypted email' },
      { category: 'Privacy', name: 'uBlock Origin', url: '', desc: 'Browser extension for ad/tracker blocking' },
      { category: 'Privacy', name: 'Privacy Badger', url: '', desc: 'Browser extension for tracker blocking' },
      { category: 'Encryption', name: 'VeraCrypt', url: '', desc: 'Free, open-source encryption' },
      { category: 'Encryption', name: '7-Zip', url: '', desc: 'Free file compression with encryption' },
      { category: 'Encryption', name: 'Cryptomator', url: '', desc: 'Free cloud storage encryption' },
    ];

    for (const r of resources) {
      await client.query(
        `INSERT INTO resources (category, name, url, description, sort_order)
         VALUES ($1, $2, $3, $4, $5)`,
        [r.category, r.name, r.url, r.desc, 0]
      );
    }

    await client.query('COMMIT');
    console.log('Seed completed successfully');
  } catch (e) {
    await client.query('ROLLBACK');
    console.error('Seed error:', e);
    throw e;
  } finally {
    client.release();
    await pool.end();
  }
}

seed().catch((e) => {
  console.error('Seed failed:', e);
  process.exit(1);
});
