import { Pool } from 'pg';

const pool = new Pool({
  host: '/tmp/opencode',
  port: 5433,
  database: 'dss_toolkit',
  user: 'zuko',
});

export async function query(text: string, params?: any[]) {
  const client = await pool.connect();
  try {
    const result = await client.query(text, params);
    return result;
  } finally {
    client.release();
  }
}

export async function getSections() {
  const result = await query('SELECT * FROM sections ORDER BY sort_order');
  return result.rows;
}

export async function getSection(id: number) {
  const result = await query('SELECT * FROM sections WHERE id = $1', [id]);
  return result.rows[0] || null;
}

export async function getSubsections(sectionId: number) {
  const result = await query(
    'SELECT * FROM subsections WHERE section_id = $1 ORDER BY sort_order',
    [sectionId]
  );
  return result.rows;
}

export async function getContentBlocks(sectionId: number, subsectionId: number | null = null) {
  if (subsectionId === null) {
    const result = await query(
      `SELECT * FROM content_blocks
       WHERE section_id = $1
       ORDER BY subsection_id NULLS FIRST, sort_order`,
      [sectionId]
    );
    return result.rows;
  }
  const result = await query(
    `SELECT * FROM content_blocks
     WHERE section_id = $1 AND subsection_id = $2
     ORDER BY sort_order`,
    [sectionId, subsectionId]
  );
  return result.rows;
}

export async function getEmergencyContacts() {
  const result = await query('SELECT * FROM emergency_contacts ORDER BY category, sort_order');
  return result.rows;
}

export async function getGlossaryTerms() {
  const result = await query('SELECT * FROM glossary_terms ORDER BY term');
  return result.rows;
}

export async function getResources() {
  const result = await query('SELECT * FROM resources ORDER BY category, sort_order');
  return result.rows;
}

export async function searchContent(searchTerm: string) {
  const term = `%${searchTerm}%`;
  const blocks = await query(
    `SELECT cb.*, s.title as section_title, s.id as section_id, sub.title as subsection_title
     FROM content_blocks cb
     LEFT JOIN sections s ON cb.section_id = s.id
     LEFT JOIN subsections sub ON cb.subsection_id = sub.id
     WHERE cb.content ILIKE $1
     ORDER BY s.sort_order, sub.sort_order, cb.sort_order
     LIMIT 50`,
    [term]
  );
  return blocks.rows;
}

export async function getSubsection(id: number) {
  const result = await query('SELECT * FROM subsections WHERE id = $1', [id]);
  return result.rows[0] || null;
}

// ── Learning paths ──

export async function getLearningPaths() {
  const result = await query(
    `SELECT lp.*, s.title as section_title, s.section_number,
            (SELECT COUNT(*) FROM learning_steps WHERE path_id = lp.id) as step_count,
            (SELECT COUNT(*) FROM quiz_questions WHERE path_id = lp.id) as question_count
     FROM learning_paths lp
     LEFT JOIN sections s ON lp.section_id = s.id
     ORDER BY lp.sort_order`
  );
  return result.rows;
}

export async function getLearningPath(pathId: number) {
  const result = await query(
    `SELECT lp.*, s.title as section_title, s.section_number
     FROM learning_paths lp
     LEFT JOIN sections s ON lp.section_id = s.id
     WHERE lp.id = $1`,
    [pathId]
  );
  return result.rows[0] || null;
}

export async function getLearningSteps(pathId: number) {
  const result = await query(
    'SELECT * FROM learning_steps WHERE path_id = $1 ORDER BY sort_order',
    [pathId]
  );
  return result.rows;
}

export async function getQuizQuestions(pathId: number) {
  const result = await query(
    'SELECT * FROM quiz_questions WHERE path_id = $1 ORDER BY sort_order',
    [pathId]
  );
  return result.rows;
}

export async function getUserProgress(userId: number, pathId: number) {
  const result = await query(
    'SELECT * FROM user_learning_progress WHERE user_id = $1 AND path_id = $2',
    [userId, pathId]
  );
  return result.rows[0] || null;
}

export async function upsertUserProgress(
  userId: number,
  pathId: number,
  stepsCompleted: number[],
  completed?: boolean
) {
  const existing = await getUserProgress(userId, pathId);
  if (existing) {
    const result = await query(
      `UPDATE user_learning_progress
       SET steps_completed = $3, completed = COALESCE($4, completed),
           completed_at = CASE WHEN $4 THEN NOW() ELSE completed_at END
       WHERE user_id = $1 AND path_id = $2
       RETURNING *`,
      [userId, pathId, stepsCompleted, completed ?? existing.completed]
    );
    return result.rows[0];
  }
  const result = await query(
    `INSERT INTO user_learning_progress (user_id, path_id, steps_completed, completed)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [userId, pathId, stepsCompleted, completed ?? false]
  );
  return result.rows[0];
}

export async function submitQuizResult(
  userId: number,
  pathId: number,
  score: number,
  total: number,
  passed: boolean
) {
  await query(
    `INSERT INTO user_learning_progress (user_id, path_id, quiz_score, quiz_passed, completed)
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (user_id, path_id)
     DO UPDATE SET quiz_score = $3, quiz_passed = $4, completed = $5
     RETURNING *`,
    [userId, pathId, score, passed, passed]
  );
}

export async function getAllUserProgress(userId: number) {
  const result = await query(
    'SELECT * FROM user_learning_progress WHERE user_id = $1',
    [userId]
  );
  return result.rows;
}

export async function createCertificate(userId: number) {
  const code = `CERT-${Date.now().toString(36).toUpperCase()}-${userId.toString(36).toUpperCase()}`;
  const result = await query(
    `INSERT INTO certificates (user_id, certificate_code, metadata)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [userId, code, JSON.stringify({ issued_at: new Date().toISOString() })]
  );
  return result.rows[0];
}

export async function getCertificate(userId: number) {
  const result = await query(
    'SELECT * FROM certificates WHERE user_id = $1 ORDER BY issued_at DESC LIMIT 1',
    [userId]
  );
  return result.rows[0] || null;
}

export async function getAllCertificates(userId: number) {
  const result = await query(
    'SELECT * FROM certificates WHERE user_id = $1 ORDER BY issued_at DESC',
    [userId]
  );
  return result.rows;
}
