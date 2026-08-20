import { Request, Response } from 'express';
import { DbService } from '../db/db.service';
import { AuthService } from '../auth/auth.service';
export declare class ProgressController {
    private db;
    private auth;
    constructor(db: DbService, auth: AuthService);
    upsert(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    get(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
