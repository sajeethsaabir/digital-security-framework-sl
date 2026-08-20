import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.DB_HOST || '/tmp/opencode',
  port: parseInt(process.env.DB_PORT || '5433', 10),
  database: process.env.DB_NAME || 'dss_toolkit',
  user: process.env.DB_USER || 'zuko',
});

@Injectable()
export class DbService implements OnModuleDestroy {
  async query(text: string, params?: any[]) {
    const client = await pool.connect();
    try {
      return await client.query(text, params);
    } finally {
      client.release();
    }
  }

  async onModuleDestroy() {
    await pool.end();
  }

  // Sections
  async getSections() {
    const result = await this.query('SELECT * FROM sections ORDER BY sort_order');
    return result.rows;
  }

  async getSection(id: number) {
    const result = await this.query('SELECT * FROM sections WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  async getSubsections(sectionId: number) {
    const result = await this.query(
      'SELECT * FROM subsections WHERE section_id = $1 ORDER BY sort_order',
      [sectionId]
    );
    return result.rows;
  }

  async getContentBlocks(sectionId: number, subsectionId: number | null = null) {
    if (subsectionId === null) {
      const result = await this.query(
        `SELECT * FROM content_blocks
         WHERE section_id = $1
         ORDER BY subsection_id NULLS FIRST, sort_order`,
        [sectionId]
      );
      return result.rows;
    }
    const result = await this.query(
      `SELECT * FROM content_blocks
       WHERE section_id = $1 AND subsection_id = $2
       ORDER BY sort_order`,
      [sectionId, subsectionId]
    );
    return result.rows;
  }

  async getSubsection(id: number) {
    const result = await this.query('SELECT * FROM subsections WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  async getEmergencyContacts() {
    const result = await this.query('SELECT * FROM emergency_contacts ORDER BY category, sort_order');
    return result.rows;
  }

  async getGlossaryTerms() {
    const result = await this.query('SELECT * FROM glossary_terms ORDER BY term');
    return result.rows;
  }

  async getResources() {
    const result = await this.query('SELECT * FROM resources ORDER BY category, sort_order');
    return result.rows;
  }

  async searchContent(searchTerm: string) {
    const term = `%${searchTerm}%`;
    const blocks = await this.query(
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

  // Learning
  async getLearningPaths() {
    const result = await this.query(
      `SELECT lp.*, s.title as section_title, s.section_number,
              (SELECT COUNT(*) FROM learning_steps WHERE path_id = lp.id) as step_count,
              (SELECT COUNT(*) FROM quiz_questions WHERE path_id = lp.id) as question_count
       FROM learning_paths lp
       LEFT JOIN sections s ON lp.section_id = s.id
       ORDER BY lp.sort_order`
    );
    return result.rows;
  }

  async getLearningPath(pathId: number) {
    const result = await this.query(
      `SELECT lp.*, s.title as section_title, s.section_number
       FROM learning_paths lp
       LEFT JOIN sections s ON lp.section_id = s.id
       WHERE lp.id = $1`,
      [pathId]
    );
    return result.rows[0] || null;
  }

  async getLearningSteps(pathId: number) {
    const result = await this.query(
      'SELECT * FROM learning_steps WHERE path_id = $1 ORDER BY sort_order',
      [pathId]
    );
    return result.rows;
  }

  async getQuizQuestions(pathId: number) {
    const result = await this.query(
      'SELECT * FROM quiz_questions WHERE path_id = $1 ORDER BY sort_order',
      [pathId]
    );
    return result.rows;
  }

  async getUserProgress(userId: number, pathId: number) {
    const result = await this.query(
      'SELECT * FROM user_learning_progress WHERE user_id = $1 AND path_id = $2',
      [userId, pathId]
    );
    return result.rows[0] || null;
  }

  async upsertUserProgress(userId: number, pathId: number, stepsCompleted: number[], completed?: boolean) {
    const existing = await this.getUserProgress(userId, pathId);
    if (existing) {
      const result = await this.query(
        `UPDATE user_learning_progress
         SET steps_completed = $3, completed = COALESCE($4, completed),
             completed_at = CASE WHEN $4 THEN NOW() ELSE completed_at END
         WHERE user_id = $1 AND path_id = $2
         RETURNING *`,
        [userId, pathId, stepsCompleted, completed ?? existing.completed]
      );
      return result.rows[0];
    }
    const result = await this.query(
      `INSERT INTO user_learning_progress (user_id, path_id, steps_completed, completed)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [userId, pathId, stepsCompleted, completed ?? false]
    );
    return result.rows[0];
  }

  async submitQuizResult(userId: number, pathId: number, score: number, total: number, passed: boolean) {
    await this.query(
      `INSERT INTO user_learning_progress (user_id, path_id, quiz_score, quiz_passed, completed)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (user_id, path_id)
       DO UPDATE SET quiz_score = $3, quiz_passed = $4, completed = $5
       RETURNING *`,
      [userId, pathId, score, passed, passed]
    );
  }

  async getAllUserProgress(userId: number) {
    const result = await this.query(
      'SELECT * FROM user_learning_progress WHERE user_id = $1',
      [userId]
    );
    return result.rows;
  }

  async createCertificate(userId: number) {
    const code = `CERT-${Date.now().toString(36).toUpperCase()}-${userId.toString(36).toUpperCase()}`;
    const result = await this.query(
      `INSERT INTO certificates (user_id, certificate_code, metadata)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [userId, code, JSON.stringify({ issued_at: new Date().toISOString() })]
    );
    return result.rows[0];
  }

  async getCertificate(userId: number) {
    const result = await this.query(
      'SELECT * FROM certificates WHERE user_id = $1 ORDER BY issued_at DESC LIMIT 1',
      [userId]
    );
    return result.rows[0] || null;
  }

  async getAllCertificates(userId: number) {
    const result = await this.query(
      'SELECT * FROM certificates WHERE user_id = $1 ORDER BY issued_at DESC',
      [userId]
    );
    return result.rows;
  }

  // Users
  async findUserByEmail(email: string) {
    const result = await this.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0] || null;
  }

  async createUser(email: string, name: string, passwordHash: string) {
    const result = await this.query(
      'INSERT INTO users (email, name, password_hash) VALUES ($1, $2, $3) RETURNING id, email, name',
      [email, name, passwordHash]
    );
    return result.rows[0];
  }

  // Sessions
  async createSession(userId: number, token: string, expiresAt: Date) {
    await this.query(
      'INSERT INTO sessions (user_id, token, expires_at) VALUES ($1, $2, $3)',
      [userId, token, expiresAt]
    );
  }

  async getUserFromToken(token: string | undefined | null) {
    if (!token || typeof token !== 'string' || token.length > 128) return null;
    const result = await this.query(
      `SELECT u.id, u.email, u.name FROM sessions s
       JOIN users u ON s.user_id = u.id
       WHERE s.token = $1 AND s.expires_at > NOW()`,
      [token]
    );
    return result.rows[0] || null;
  }

  async deleteSession(token: string) {
    if (!token || typeof token !== 'string') return;
    await this.query('DELETE FROM sessions WHERE token = $1', [token]);
  }

  // Progress (checklist)
  async upsertChecklistProgress(userId: number, contentBlockId: number, checked: boolean) {
    await this.query(
      `INSERT INTO user_progress (user_id, content_block_id, checked, updated_at)
       VALUES ($1, $2, $3, NOW())
       ON CONFLICT (user_id, content_block_id)
       DO UPDATE SET checked = $3, updated_at = NOW()`,
      [userId, contentBlockId, checked]
    );
  }

  async getChecklistProgress(userId: number) {
    const result = await this.query(
      'SELECT content_block_id, checked FROM user_progress WHERE user_id = $1',
      [userId]
    );
    return result.rows;
  }
}
