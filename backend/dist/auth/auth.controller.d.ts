import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { DbService } from '../db/db.service';
export declare class AuthController {
    private auth;
    private db;
    constructor(auth: AuthService, db: DbService);
    login(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    signup(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    logout(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    me(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
