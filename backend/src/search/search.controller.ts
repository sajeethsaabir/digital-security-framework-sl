import { Controller, Get, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { DbService } from '../db/db.service';

@Controller('api/search')
export class SearchController {
  constructor(private db: DbService) {}

  @Get()
  async search(@Query('q') q: string, @Res() res: Response) {
    if (!q || q.length < 2) {
      return res.json({ results: [] });
    }

    try {
      const results = await this.db.searchContent(q);
      return res.json({ results });
    } catch (error) {
      console.error('Search error:', error);
      return res.json({ results: [] });
    }
  }
}
