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

async function seedLearning() {
  await q('DELETE FROM certificates');
  await q('DELETE FROM user_learning_progress');
  await q('DELETE FROM quiz_questions');
  await q('DELETE FROM learning_steps');
  await q('DELETE FROM learning_paths');

  // Look up section IDs by section_number
  const secMap = {};
  const secs = await q('SELECT id, section_number FROM sections');
  for (const s of secs.rows) secMap[s.section_number] = s.id;

  const paths = [
    {
      title: 'Recognize a Cyberattack',
      section_num: '1',
      description: 'Learn to identify the warning signs of a cyberattack and respond with confidence.',
      icon: 'alert',
      difficulty: 'beginner',
      minutes: 10,
      steps: [
        { num: 1, title: 'What is a Cyberattack?', content: 'A cyberattack is any malicious attempt to access, damage, or disrupt your computer systems, networks, or data. Attacks can target anyone — individuals, businesses, or governments.', action_type: 'read' },
        { num: 2, title: 'Common Warning Signs', content: 'Slow computer, pop-ups demanding payment, files you can\'t open, disabled antivirus, strange login notifications, missing money, passwords that don\'t work.', action_type: 'read' },
        { num: 3, title: 'Test Your Knowledge', content: 'Can you spot the warning signs? Take the quick assessment below.', action_type: 'quiz', action_url: '/learn/quiz/1' },
        { num: 4, title: 'Hands-On: Device Check', content: 'Open your device settings and check: Are your antivirus and firewall active? When was your last security update? Write down anything unusual.', action_type: 'practice' },
        { num: 5, title: 'Review & Reflect', content: 'You now know the warning signs. If you see any of them, remember: stay calm, disconnect, document, and report.', action_type: 'read' },
      ],
      questions: [
        { q: 'Which of the following is a sign of a possible cyberattack?', opts: ['Computer running faster than usual', 'Pop-up messages demanding payment', 'New wallpaper on your desktop', 'Browser bookmarks you added yourself'], correct: 1, exp: 'Ransomware and other malware often display pop-ups demanding payment. This is a major red flag.' },
        { q: 'What should you do FIRST if you suspect a cyberattack?', opts: ['Pay any ransom demand', 'Turn off your computer completely', 'Stay calm and disconnect from the internet', 'Call your friends for advice'], correct: 2, exp: 'Stay calm first, then disconnect from the internet to prevent the attack from spreading.' },
        { q: 'Why should you NOT turn off your computer immediately during an attack?', opts: ['It might damage the hardware', 'You may lose evidence needed for investigation', 'The attack will go away on its own', 'The computer needs to cool down'], correct: 1, exp: 'Turning off the computer can destroy volatile evidence (like running processes in memory) that investigators need.' },
      ],
    },
    {
      title: 'Protect Your Data',
      section_num: 3,
      description: 'Master the fundamentals of data protection — passwords, encryption, backups, and privacy.',
      icon: 'lock',
      difficulty: 'beginner',
      minutes: 15,
      steps: [
        { num: 1, title: 'Know Your Data', content: 'Your data includes: personal info (name, address, NIC), financial data (bank accounts, cards), accounts (emails, social media), and files (photos, documents).', action_type: 'read' },
        { num: 2, title: 'Password Superpowers', content: 'Use a unique password for every account. Make them long (12+ chars) with uppercase, lowercase, numbers, and symbols. Use a password manager like Bitwarden or KeePass.', action_type: 'read' },
        { num: 3, title: 'Encryption Basics', content: 'Encryption scrambles your data so only authorized people can read it. Enable Full Disk Encryption on your devices. Look for HTTPS in your browser bar.', action_type: 'read' },
        { num: 4, title: 'The 3-2-1 Backup Rule', content: 'Keep 3 copies of your data, on 2 different types of media, with 1 copy stored offsite (or in the cloud with encryption).', action_type: 'read' },
        { num: 5, title: 'Hands-On: Password Health Check', content: 'Go to haveibeenpwned.com and check if any of your accounts have been compromised. Change any compromised passwords immediately.', action_type: 'practice', action_url: 'https://haveibeenpwned.com' },
        { num: 6, title: 'Test Your Knowledge', content: 'Take the data protection quiz to see what you\'ve learned.', action_type: 'quiz', action_url: '/learn/quiz/2' },
      ],
      questions: [
        { q: 'What is the minimum recommended length for a strong password?', opts: ['6 characters', '8 characters', '12 characters', '20 characters'], correct: 2, exp: 'Security experts recommend passwords of at least 12 characters for adequate protection.' },
        { q: 'What does the "3-2-1" backup rule mean?', opts: ['3 backups, 2 locations, 1 password', '3 copies, 2 media types, 1 offsite', '3 devices, 2 networks, 1 year', '3 users, 2 admins, 1 backup'], correct: 1, exp: '3 copies of your data, on 2 different types of media, with 1 copy stored offsite.' },
        { q: 'How can you tell if a website uses encryption?', opts: ['The site has many images', 'The URL starts with https://', 'The site loads quickly', 'The site has a search bar'], correct: 1, exp: 'HTTPS (the "s" stands for secure) means the connection is encrypted.' },
        { q: 'What should you do if you find a compromised account on haveibeenpwned.com?', opts: ['Ignore it — it\'s probably a false alarm', 'Change the password immediately', 'Delete the account', 'Post about it on social media'], correct: 1, exp: 'Change the compromised password immediately, and use a unique password you haven\'t used elsewhere.' },
      ],
    },
    {
      title: 'Prevent Cyber Threats',
      section_num: 4,
      description: 'Build daily habits to prevent attacks before they happen — email safety, secure browsing, and device hygiene.',
      icon: 'shield',
      difficulty: 'intermediate',
      minutes: 20,
      steps: [
        { num: 1, title: 'Daily Security Habits', content: 'Small daily habits make a big difference: lock your screen when stepping away, verify before clicking, update software promptly.', action_type: 'read' },
        { num: 2, title: 'Spot Phishing Emails', content: 'Look for: urgent language, generic greetings ("Dear Customer"), mismatched sender addresses, suspicious attachments, requests for personal info.', action_type: 'read' },
        { num: 3, title: 'Safe Browsing Checklist', content: 'Only use HTTPS sites. Don\'t download from untrusted sources. Use a browser with built-in protection (Chrome, Firefox, Edge). Enable pop-up blockers.', action_type: 'read' },
        { num: 4, title: 'Wi-Fi Safety Rules', content: 'Never access banking on public Wi-Fi. Use a VPN on public networks. Change your home Wi-Fi password regularly. Disable WPS on your router.', action_type: 'read' },
        { num: 5, title: 'Hands-On: Phishing Spotter', content: 'Look at the last 5 emails in your inbox. Can you tell which are legitimate and which might be phishing? Check sender addresses carefully for misspellings.', action_type: 'practice' },
        { num: 6, title: 'Test Your Knowledge', content: 'How well can you spot threats? Take the prevention quiz.', action_type: 'quiz', action_url: '/learn/quiz/3' },
      ],
      questions: [
        { q: 'What is a common sign of a phishing email?', opts: ['It addresses you by your full name', 'It uses urgent language and threats', 'It comes from someone you know', 'It has a professional design'], correct: 1, exp: 'Phishing emails often create false urgency ("Act now!", "Your account will be closed!") to make you act without thinking.' },
        { q: 'Should you use public Wi-Fi for online banking?', opts: ['Yes, it\'s convenient', 'Only if you\'re in a hurry', 'No, never — use mobile data instead', 'Only if the Wi-Fi has a password'], correct: 2, exp: 'Public Wi-Fi networks can be intercepted. Always use mobile data or a VPN for sensitive transactions.' },
        { q: 'What does HTTPS indicate?', opts: ['The website is official', 'The connection is encrypted', 'The site has no viruses', 'The site is free to use'], correct: 1, exp: 'HTTPS encrypts the data between your browser and the website, protecting it from interception.' },
      ],
    },
    {
      title: 'Digital Safety Best Practices',
      section_num: 5,
      description: 'Build a security-first mindset and integrate safe habits into your daily routine.',
      icon: 'star',
      difficulty: 'intermediate',
      minutes: 15,
      steps: [
        { num: 1, title: 'Digital Hygiene Routine', content: 'Weekly: update software, review account activity. Monthly: check connected apps, review privacy settings. Quarterly: audit passwords, clean up old accounts.', action_type: 'read' },
        { num: 2, title: 'Security Mindset', content: 'Think before you click. Verify before you trust. If it seems too good to be true, it probably is. Security is a habit, not a one-time task.', action_type: 'read' },
        { num: 3, title: 'Privacy Checkup', content: 'Review: social media privacy settings, app permissions on your phone, browser extensions, location sharing, saved passwords in browsers.', action_type: 'read' },
        { num: 4, title: 'Hands-On: Social Media Audit', content: 'Open your social media privacy settings. Check: who can see your posts, what apps have access to your account, whether your profile is public or private.', action_type: 'practice' },
        { num: 5, title: 'Test Your Knowledge', content: 'How strong are your security habits? Take the best practices quiz.', action_type: 'quiz', action_url: '/learn/quiz/4' },
      ],
      questions: [
        { q: 'How often should you update your software?', opts: ['Once a year', 'Only when you have problems', 'As soon as updates are available', 'Never — updates slow down your device'], correct: 2, exp: 'Security updates patch vulnerabilities that hackers exploit. Install them as soon as they\'re available.' },
        { q: 'What should you do before clicking a link in an email?', opts: ['Click it quickly before it expires', 'Hover over it to see the real destination', 'Forward it to a friend first', 'Always click — emails are safe'], correct: 1, exp: 'Hover over links to reveal the actual URL. If it doesn\'t match the expected destination, don\'t click.' },
        { q: 'Which app permission should you be most cautious about?', opts: ['Camera and microphone access', 'Notification access', 'Screen brightness control', 'Wallpaper setting'], correct: 0, exp: 'Camera and microphone access can be misused to spy on you. Only grant these permissions to trusted apps.' },
      ],
    },
    {
      title: 'Report Cyber Incidents',
      section_num: 6,
      description: 'Know exactly how and where to report cyber incidents in Sri Lanka — step by step.',
      icon: 'report',
      difficulty: 'beginner',
      minutes: 10,
      steps: [
        { num: 1, title: 'Why Reporting Matters', content: 'Reporting helps authorities track criminals, warn others, and improve national cybersecurity. It also creates an official record that may help you recover losses.', action_type: 'read' },
        { num: 2, title: 'Primary Authorities', content: 'SLCERT (Sri Lanka CERT|CC) — for technical cyber incidents. Police (119/118) — for criminal cyber activity. Your Bank — for financial fraud.', action_type: 'read' },
        { num: 3, title: 'What to Prepare', content: 'Timeline of events, screenshots/photos, device information, account details, any communications with attackers, list of losses or damages.', action_type: 'read' },
        { num: 4, title: 'Hands-On: Create Your Report Kit', content: 'Create a folder on your device called "Incident Kit". Add a blank document with these headings: Date/Time, What Happened, Affected Accounts, Actions Taken, Contacts Notified.', action_type: 'practice' },
        { num: 5, title: 'Test Your Knowledge', content: 'Do you know who to call? Take the reporting quiz.', action_type: 'quiz', action_url: '/learn/quiz/5' },
      ],
      questions: [
        { q: 'Who should you contact FIRST for a technical cyber incident in Sri Lanka?', opts: ['The police', 'Your internet provider', 'SLCERT', 'The nearest computer shop'], correct: 2, exp: 'SLCERT (Sri Lanka CERT|CC) is the national cyber security incident response team. Call them at +94 11 2 691 691.' },
        { q: 'What police number should you call for cyber crime in Sri Lanka?', opts: ['119 or 118', '1990', '1919', '112'], correct: 0, exp: 'For criminal cyber activity, call the police emergency line at 119 or 118.' },
        { q: 'Why is it important to document everything during a cyber incident?', opts: ['To post on social media', 'To create an official record for authorities and insurance', 'To show your friends', 'It\'s not important'], correct: 1, exp: 'Detailed documentation helps authorities investigate and may be needed for insurance claims or legal action.' },
      ],
    },
    {
      title: 'Emergency Response',
      section_num: '6',
      description: 'Your quick-action guide for when every second counts during an active cyberattack.',
      icon: 'emergency',
      difficulty: 'beginner',
      minutes: 8,
      steps: [
        { num: 1, title: 'Being Hacked Right Now?', content: 'Disconnect from internet immediately. Don\'t turn off your device (preserve evidence). Take photos with your phone. Call SLCERT: +94 11 2 691 691.', action_type: 'read' },
        { num: 2, title: 'Money Being Stolen?', content: 'Call your bank immediately. Request account freeze. Call police: 119 or 118. Document all transactions. Act within minutes — every second counts.', action_type: 'read' },
        { num: 3, title: 'Phone Stolen?', content: 'Call your provider to block the SIM. Use Find My Device to locate/track. Change passwords from another device. Report to police immediately.', action_type: 'read' },
        { num: 4, title: 'Build Your Emergency Plan', content: 'Save these numbers in your phone NOW: SLCERT (+94 11 2 691 691), Police (119/118), Your Bank\'s hotline. Share this plan with family members.', action_type: 'practice' },
        { num: 5, title: 'Test Your Knowledge', content: 'Can you respond under pressure? Take the emergency response quiz.', action_type: 'quiz', action_url: '/learn/quiz/6' },
      ],
      questions: [
        { q: 'What is the FIRST thing to do if you\'re being hacked right now?', opts: ['Call the police', 'Disconnect from the internet', 'Turn off your computer', 'Change your passwords'], correct: 1, exp: 'Disconnecting from the internet stops the attack from spreading and prevents further data theft.' },
        { q: 'Should you turn off your device during a hack?', opts: ['Yes, immediately', 'No — it may destroy evidence', 'Only if you\'re sure', 'It doesn\'t matter'], correct: 1, exp: 'Keep the device on to preserve evidence like running processes and network connections that investigators need.' },
        { q: 'What should you do if money is being stolen from your bank account?', opts: ['Wait to see if more is taken', 'Post about it on social media first', 'Call your bank immediately to freeze the account', 'Transfer remaining money to another account'], correct: 2, exp: 'Your first call should be to your bank to freeze the account and stop further unauthorized transactions.' },
      ],
    },
  ];

  for (const path of paths) {
    const secId = secMap[path.section_num];
    if (!secId) { console.error('Section not found for num:', path.section_num); continue; }
    const r = await q(
      'INSERT INTO learning_paths (section_id, title, description, icon, difficulty, estimated_minutes, sort_order) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id',
      [secId, path.title, path.description, path.icon, path.difficulty, path.minutes, 0]
    );
    const pathId = r.rows[0].id;

    for (const step of path.steps) {
      await q(
        'INSERT INTO learning_steps (path_id, step_number, title, content, action_type, action_url, sort_order) VALUES ($1,$2,$3,$4,$5,$6,$7)',
        [pathId, step.num, step.title, step.content, step.action_type, step.action_url || null, step.num]
      );
    }

    for (let qi = 0; qi < path.questions.length; qi++) {
      const qq = path.questions[qi];
      await q(
        'INSERT INTO quiz_questions (path_id, question, options, correct_index, explanation, sort_order) VALUES ($1,$2,$3,$4,$5,$6)',
        [pathId, qq.q, qq.opts, qq.correct, qq.exp, qi]
      );
    }
  }

  const counts = {
    paths: (await q('SELECT COUNT(*) FROM learning_paths')).rows[0].count,
    steps: (await q('SELECT COUNT(*) FROM learning_steps')).rows[0].count,
    questions: (await q('SELECT COUNT(*) FROM quiz_questions')).rows[0].count,
  };
  console.log('Learning seed complete:', JSON.stringify(counts, null, 2));
  await pool.end();
}

seedLearning().catch(e => { console.error(e); process.exit(1); });
