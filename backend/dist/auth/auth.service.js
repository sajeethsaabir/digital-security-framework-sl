"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const db_service_1 = require("../db/db.service");
const TOKEN_BYTES = 32;
const SESSION_DAYS = 30;
let AuthService = class AuthService {
    db;
    constructor(db) {
        this.db = db;
    }
    hashPassword(password) {
        const salt = (0, crypto_1.randomBytes)(16).toString('hex');
        const iterations = 100000;
        let hash = password;
        for (let i = 0; i < iterations; i++) {
            hash = (0, crypto_1.createHash)('sha256').update(salt + hash).digest('hex');
        }
        return `${salt}:${hash}`;
    }
    verifyPassword(password, stored) {
        const [salt, hash] = stored.split(':');
        if (!salt || !hash)
            return false;
        const iterations = 100000;
        let check = password;
        for (let i = 0; i < iterations; i++) {
            check = (0, crypto_1.createHash)('sha256').update(salt + check).digest('hex');
        }
        try {
            const hashBuf = Buffer.from(hash, 'hex');
            const checkBuf = Buffer.from(check, 'hex');
            if (hashBuf.length !== checkBuf.length)
                return false;
            return (0, crypto_1.timingSafeEqual)(hashBuf, checkBuf);
        }
        catch {
            return false;
        }
    }
    generateToken() {
        return (0, crypto_1.randomBytes)(TOKEN_BYTES).toString('hex');
    }
    async createSession(userId) {
        const token = this.generateToken();
        const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);
        await this.db.createSession(userId, token, expiresAt);
        return token;
    }
    async getUserFromToken(token) {
        return this.db.getUserFromToken(token);
    }
    async deleteSession(token) {
        await this.db.deleteSession(token);
    }
    async findUserByEmail(email) {
        return this.db.findUserByEmail(email);
    }
    async createUser(email, name, passwordHash) {
        return this.db.createUser(email, name, passwordHash);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [db_service_1.DbService])
], AuthService);
//# sourceMappingURL=auth.service.js.map