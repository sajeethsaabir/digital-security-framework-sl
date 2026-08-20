import { Controller, Post, Get, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { DbService } from '../db/db.service';
import { AuthService } from '../auth/auth.service';

function getTokenFromCookie(req: Request): string | undefined {
  if ((req as any).cookies?.session) return (req as any).cookies.session;
  const cookieHeader = req.headers.cookie || '';
  return cookieHeader.split(';').find((c) => c.trim().startsWith('session='))?.split('=')[1]?.trim();
}

@Controller('api/progress')
export class ProgressController {
  constructor(
    private db: DbService,
    private auth: AuthService,
  ) {}

  @Post()
  async upsert(@Req() req: Request, @Res() res: Response) {
    const token = getTokenFromCookie(req);
    const user = await this.auth.getUserFromToken(token);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    const { content_block_id, checked } = req.body || {};
    if (typeof content_block_id !== 'number' || typeof checked !== 'boolean') {
      return res.status(400).json({ error: 'Invalid request body' });
    }

    await this.db.upsertChecklistProgress(user.id, content_block_id, checked);
    return res.json({ ok: true });
  }

  @Get()
  async get(@Req() req: Request, @Res() res: Response) {
    const token = getTokenFromCookie(req);
    const user = await this.auth.getUserFromToken(token);
    if (!user) return res.json({ progress: [] });

    const progress = await this.db.getChecklistProgress(user.id);
    return res.json({ progress });
  }
}
