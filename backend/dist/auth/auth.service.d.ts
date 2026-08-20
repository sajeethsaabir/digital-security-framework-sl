import { DbService } from '../db/db.service';
export declare class AuthService {
    private db;
    constructor(db: DbService);
    hashPassword(password: string): string;
    verifyPassword(password: string, stored: string): boolean;
    generateToken(): string;
    createSession(userId: number): Promise<string>;
    getUserFromToken(token: string | undefined | null): Promise<any>;
    deleteSession(token: string): Promise<void>;
    findUserByEmail(email: string): Promise<any>;
    createUser(email: string, name: string, passwordHash: string): Promise<any>;
}
