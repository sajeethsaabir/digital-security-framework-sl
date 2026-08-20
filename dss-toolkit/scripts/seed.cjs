const fs = require('fs');
const { Pool } = require('pg');

const pool = new Pool({
  host: '/tmp/opencode',
  port: 5433,
  database: 'dss_toolkit',
  user: 'zuko',
});

async function q(text, params) {
  const c = await pool.connect();
  try { return await c.query(text, params); } finally { c.release(); }
}

async function seed() {
  const md = fs.readFileSync(process.argv[2], 'utf-8');
  const lines = md.split('\n');

  await q('DELETE FROM resources');
  await q('DELETE FROM glossary_terms');
  await q('DELETE FROM emergency_contacts');
  await q('DELETE FROM content_blocks');
  await q('DELETE FROM subsections');
  await q('DELETE FROM sections');

  let sid = null, subid = null, sord = 0, subord = 0, bord = 0;

  async function ins(type, content) {
    if (!content || !content.trim()) return;
    await q(
      'INSERT INTO content_blocks (section_id,subsection_id,content_type,content,level,sort_order) VALUES ($1,$2,$3,$4,$5,$6)',
      [sid, subid, type, content.trim(), 0, bord++]
    );
  }

  function classify(line) {
    const t = line.trim();
    if (!t || t.startsWith('```')) return null;
    if (t.startsWith('> ⚠') || t.startsWith('> !') || t.startsWith('> **⚠')) return ['warning', t.replace(/^>\s*\*?⚠? ?\*?\*?\s*/, '')];
    if (t.startsWith('> 💡') || t.startsWith('> **💡') || t.startsWith('> **Tip')) return ['tip', t.replace(/^>\s*\*?💡? ?\*?\*?\s*/, '')];
    if (t.startsWith('> ')) return ['text', t.replace(/^>\s*/, '')];
    if (t.startsWith('□ ') || t.startsWith('- [ ] ') || t.startsWith('- [x] ')) return ['checklist', t.replace(/^[□\-]\s*\[[ x]\]\s*/, '')];
    if (t.startsWith('- ')) return ['bullet', t.replace(/^- /, '')];
    if (/^\d+\.\s/.test(t)) return ['numbered', t.replace(/^\d+\.\s+/, '')];
    if (t.length > 3 && !t.startsWith('[') && !t.startsWith('|') && !t.startsWith('---')) return ['text', t.replace(/\*\*/g, '')];
    return null;
  }

  // Parse sections 1-6 (with # heading)
  for (let i = 0; i < lines.length; i++) {
    const h1 = lines[i].match(/^#\s+<a\s+id="[^"]*"><\/a>(.+)/);
    if (!h1) continue;

    let title = h1[1].trim().replace(/\\/g, '');
    const numMatch = title.match(/^(\d+)\.?\s*(.+)/);
    const secNum = numMatch ? numMatch[1] : null;
    const cleanTitle = numMatch ? numMatch[2].trim() : title;

    // Skip resource and glossary sections (detected by number)
    if (secNum === '7' || secNum === '8') continue;

    const r = await q('INSERT INTO sections (section_number,title,sort_order) VALUES ($1,$2,$3) RETURNING id',
      [secNum, cleanTitle, sord++]);
    sid = r.rows[0].id;
    subid = null; subord = 0; bord = 0;

    // Walk forward until next # or end
    for (let j = i + 1; j < lines.length; j++) {
      if (lines[j].startsWith('# ')) break;

      const h2 = lines[j].match(/^##\s+<a\s+id="[^"]*"><\/a>(.+)/);
      if (h2) {
        let t = h2[1].trim().replace(/\\/g, '');
        const nm = t.match(/^(\d+\.\d+)\s+(.+)/);
        const r2 = await q('INSERT INTO subsections (section_id,subsection_number,title,sort_order) VALUES ($1,$2,$3,$4) RETURNING id',
          [sid, nm ? nm[1] : null, nm ? nm[2].trim() : t, subord++]);
        subid = r2.rows[0].id;
        bord = 0;
        continue;
      }

      const h3 = lines[j].match(/^###\s+(.+)/);
      if (h3 && subid) {
        await ins('subheading', h3[1].trim().replace(/<a\s+id="[^"]*"><\/a>\s*/, ''));
        continue;
      }

      const cls = classify(lines[j]);
      if (cls) await ins(cls[0], cls[1]);
    }
  }

  // Emergency contacts — extract from section 6 body
  const ecData = [
    { name: 'SLCERT 24/7 Hotline', cat: 'Cyber Security Emergency', phone: '+94 11 2 691 691', email: 'incidents@cert.gov.lk', web: 'https://www.cert.gov.lk' },
    { name: 'Police Emergency', cat: 'Criminal Cyber Incident', phone: '119 or 118', web: 'https://www.police.lk' },
    { name: 'CID', cat: 'Criminal Cyber Incident', phone: '011 2 691 500' },
    { name: "Your Bank's 24/7 Hotline", cat: 'Banking Fraud', phone: null, desc: 'Keep this saved in your phone' },
    { name: 'Central Bank', cat: 'Banking Fraud', phone: '+94 11 2 477 000', web: 'https://www.cbsl.gov.lk' },
    { name: 'TRCSL Hotline', cat: 'Telecom Issues', phone: '2423', web: 'https://www.trc.gov.lk' },
    { name: 'TRCSL Office', cat: 'Telecom Issues', phone: '+94 11 2 671 228' },
    { name: 'CAA Hotline', cat: 'Consumer Complaints', phone: '1979', web: 'https://www.caa.gov.lk' },
  ];
  for (const e of ecData) {
    await q('INSERT INTO emergency_contacts (category,name,phone,email,website,description,sort_order) VALUES ($1,$2,$3,$4,$5,$6,$7)',
      [e.cat, e.name, e.phone || null, e.email || null, e.web || null, e.desc || null, 0]);
  }

  // Glossary — lines at end of file with format "Term:" followed by definition
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim().replace(/\\/g, '').toUpperCase().startsWith('8. GLOSSARY')) {
      // Skip intro line "Common Cybersecurity Terms Explained:"
      let j = i + 1;
      while (j < lines.length && !lines[j].trim()) j++;
      if (lines[j].trim().replace(/\\/g, '').startsWith('Common')) j++;

      for (; j < lines.length; j++) {
        const raw = lines[j].trim().replace(/\\/g, '');
        if (!raw) continue;
        if (/^\d+\./.test(raw) || raw.startsWith('#')) break;

        // Glossary term: line ending with ":" and not a URL or generic intro text
        if (/^[A-Za-z0-9].+:$/.test(raw) && !/^https?:/i.test(raw) && !raw.startsWith('Common')) {
          const term = raw.replace(/:$/, '').trim();
          let def = '';
          for (let k = j + 1; k < lines.length; k++) {
            const nxt = lines[k].trim().replace(/\\/g, '');
            if (/^[A-Za-z0-9].+:$/.test(nxt) && !/^https?:/i.test(nxt)) break;
            if (/^\d+\./.test(nxt) || nxt.startsWith('#')) break;
            if (nxt) def += ' ' + nxt;
          }
          def = def.trim().replace(/\s+/g, ' ');
          if (term && def && def.length > 5) {
            await q('INSERT INTO glossary_terms (term,definition) VALUES ($1,$2) ON CONFLICT DO NOTHING',
              [term, def]);
          }
        }
      }
      break;
    }
  }

  // Resources — "Name: https://url" format
  let resStart = null;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim().replace(/\\/g, '').toUpperCase().startsWith('7. RESOURCES')) { resStart = i; break; }
  }
  if (resStart) {
    let cat = 'General';
    for (let j = resStart + 1; j < lines.length; j++) {
      const raw = lines[j].trim().replace(/\\/g, '');
      if (!raw) continue;
      if (/^\d+\.\s+GLOSSARY/i.test(raw)) break;

      // Category header: not ending with ":https?://"
      if (/^[A-Z][^:]+:\s*$/.test(raw) && !/: https?:\/\//i.test(raw)) {
        cat = raw.replace(/:$/, '').trim();
        continue;
      }

      // Resource: "Name: https://..."
      const rm = raw.match(/^(.+?):\s+(https?:\/\/\S+)$/i);
      if (rm) {
        await q('INSERT INTO resources (category,name,url,sort_order) VALUES ($1,$2,$3,$4)',
          [cat, rm[1].trim(), rm[2].trim(), 0]);
      }
    }
  }

  const c = {
    sections: (await q('SELECT COUNT(*) FROM sections')).rows[0].count,
    subsections: (await q('SELECT COUNT(*) FROM subsections')).rows[0].count,
    blocks: (await q('SELECT COUNT(*) FROM content_blocks')).rows[0].count,
    contacts: (await q('SELECT COUNT(*) FROM emergency_contacts')).rows[0].count,
    glossary: (await q('SELECT COUNT(*) FROM glossary_terms')).rows[0].count,
    resources: (await q('SELECT COUNT(*) FROM resources')).rows[0].count,
  };
  console.log('Seed complete:', JSON.stringify(c, null, 2));
  await pool.end();
}

seed().catch(e => { console.error(e); process.exit(1); });
