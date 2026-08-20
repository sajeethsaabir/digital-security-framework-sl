import { Response } from 'express';
import { DbService } from '../db/db.service';
export declare class SearchController {
    private db;
    constructor(db: DbService);
    search(q: string, res: Response): Promise<Response<any, Record<string, any>>>;
}
