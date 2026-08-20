import { Controller, Get, Post, Query, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { DbService } from '../db/db.service';
import { AuthService } from '../auth/auth.service';

function getTokenFromCookie(req: Request): string | undefined {
  if ((req as any).cookies?.session) return (req as any).cookies.session;
  const cookieHeader = req.headers.cookie || '';
  return cookieHeader.split(';').find((c) => c.trim().startsWith('session='))?.split('=')[1]?.trim();
}

@Controller('api/learn')
export class LearnController {
  constructor(
    private db: DbService,
    private auth: AuthService,
  ) {}

  // ── Path Data ──

  @Get('path-data')
  async pathData(@Query('all') all: string, @Query('id') id: string, @Res() res: Response) {
    if (all) {
      const paths = await this.db.getLearningPaths();
      return res.json({ paths });
    }

    const parsedId = parseInt(id || '', 10);
    if (isNaN(parsedId)) return res.status(400).json({ error: 'Invalid id' });

    const path = await this.db.getLearningPath(parsedId);
    if (!path) return res.status(404).json({ error: 'Not found' });

    const steps = await this.db.getLearningSteps(parsedId);
    return res.json({ path, steps });
  }

  // ── Quiz Data ──

  @Get('quiz-data')
  async quizData(@Query('id') id: string, @Res() res: Response) {
    const parsedId = parseInt(id || '', 10);
    if (isNaN(parsedId)) return res.status(400).json({ error: 'Invalid id' });

    const questions = await this.db.getQuizQuestions(parsedId);
    return res.json({ questions });
  }

  // ── Progress ──

  @Get('progress')
  async getProgress(@Req() req: Request, @Res() res: Response) {
    const token = getTokenFromCookie(req);
    const user = await this.auth.getUserFromToken(token);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    const progress = await this.db.getAllUserProgress(user.id);
    return res.json({ progress });
  }

  @Post('progress')
  async upsertProgress(@Req() req: Request, @Res() res: Response) {
    const token = getTokenFromCookie(req);
    const user = await this.auth.getUserFromToken(token);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    const { pathId, stepsCompleted, completed } = req.body || {};
    if (!pathId) return res.status(400).json({ error: 'pathId required' });

    const result = await this.db.upsertUserProgress(user.id, pathId, stepsCompleted || [], completed);
    return res.json({ progress: result });
  }

  // ── Quiz Submission ──

  @Post('quiz')
  async submitQuiz(@Req() req: Request, @Res() res: Response) {
    const token = getTokenFromCookie(req);
    const user = await this.auth.getUserFromToken(token);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    const { pathId, answers } = req.body || {};
    if (!pathId || !answers) return res.status(400).json({ error: 'pathId and answers required' });

    const questions = await this.db.getQuizQuestions(pathId);
    let score = 0;
    const results = questions.map((q: any, i: number) => {
      const correct = answers[i] === q.correct_index;
      if (correct) score++;
      return { questionId: q.id, correct, correctIndex: q.correct_index, explanation: q.explanation };
    });

    const total = questions.length;
    const passed = score >= Math.ceil(total * 0.7);

    await this.db.submitQuizResult(user.id, pathId, score, total, passed);

    let certificate: any = null;
    if (passed) {
      const steps = await this.db.getLearningSteps(pathId);
      const allStepIds = steps.map((s: any) => s.id);
      await this.db.upsertUserProgress(user.id, pathId, allStepIds, true);

      const allProgress = await this.db.getAllUserProgress(user.id);
      const allPaths = await this.db.getLearningPaths();
      const allCompleted = allPaths.every((p: any) =>
        allProgress.find((pr: any) => pr.path_id === p.id && pr.completed)
      );
      if (allCompleted) {
        certificate = await this.db.createCertificate(user.id);
      }
    }

    return res.json({ score, total, passed, results });
  }

  // ── Certificate ──

  @Get('certificate')
  async getCertificate(@Req() req: Request, @Res() res: Response) {
    const token = getTokenFromCookie(req);
    const user = await this.auth.getUserFromToken(token);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    const cert = await this.db.getCertificate(user.id);
    const allCerts = await this.db.getAllCertificates(user.id);
    return res.json({ certificate: cert, all: allCerts });
  }

  @Post('certificate')
  async createCertificate(@Req() req: Request, @Res() res: Response) {
    const token = getTokenFromCookie(req);
    const user = await this.auth.getUserFromToken(token);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    const progress = await this.db.getAllUserProgress(user.id);
    const paths = await this.db.getLearningPaths();
    const allCompleted = paths.every((p: any) =>
      progress.find((pr: any) => pr.path_id === p.id && pr.completed)
    );

    if (!allCompleted) {
      return res.status(400).json({ error: 'Complete all learning paths first' });
    }

    const existing = await this.db.getCertificate(user.id);
    if (existing) return res.json({ certificate: existing });

    const cert = await this.db.createCertificate(user.id);
    return res.json({ certificate: cert });
  }
}
