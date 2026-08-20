import { Request, Response } from 'express';
import { DbService } from '../db/db.service';
import { AuthService } from '../auth/auth.service';
export declare class LearnController {
    private db;
    private auth;
    constructor(db: DbService, auth: AuthService);
    pathData(all: string, id: string, res: Response): Promise<Response<any, Record<string, any>>>;
    quizData(id: string, res: Response): Promise<Response<any, Record<string, any>>>;
    getProgress(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    upsertProgress(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    submitQuiz(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    getCertificate(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    createCertificate(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
