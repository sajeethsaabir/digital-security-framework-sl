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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const db_service_1 = require("../db/db.service");
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
function getTokenFromCookie(req) {
    if (req.cookies?.session)
        return req.cookies.session;
    const cookieHeader = req.headers.cookie || '';
    return cookieHeader.split(';').find((c) => c.trim().startsWith('session='))?.split('=')[1]?.trim();
}
let AuthController = class AuthController {
    auth;
    db;
    constructor(auth, db) {
        this.auth = auth;
        this.db = db;
    }
    async login(req, res) {
        try {
            const { email, password } = req.body || {};
            if (!email || typeof email !== 'string') {
                return res.status(400).json({ error: 'Email is required' });
            }
            if (!EMAIL_REGEX.test(email.trim())) {
                return res.status(400).json({ error: 'Invalid email format' });
            }
            if (!password || typeof password !== 'string' || password.length < 1) {
                return res.status(400).json({ error: 'Password is required' });
            }
            const user = await this.auth.findUserByEmail(email.trim().toLowerCase());
            if (!user) {
                await new Promise((r) => setTimeout(r, 200 + Math.random() * 300));
                return res.status(401).json({ error: 'Invalid email or password' });
            }
            if (!this.auth.verifyPassword(password, user.password_hash)) {
                await new Promise((r) => setTimeout(r, 200 + Math.random() * 300));
                return res.status(401).json({ error: 'Invalid email or password' });
            }
            const token = await this.auth.createSession(user.id);
            res.cookie('session', token, {
                httpOnly: true,
                secure: true,
                path: '/',
                maxAge: 30 * 24 * 60 * 60 * 1000,
                sameSite: 'strict',
            });
            return res.json({ user: { id: user.id, email: user.email, name: user.name } });
        }
        catch (e) {
            console.error('Login error:', e);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
    async signup(req, res) {
        try {
            const { email, password, name: rawName } = req.body || {};
            if (!email || typeof email !== 'string') {
                return res.status(400).json({ error: 'Email is required' });
            }
            if (!EMAIL_REGEX.test(email.trim())) {
                return res.status(400).json({ error: 'Invalid email format' });
            }
            if (email.trim().length > 254) {
                return res.status(400).json({ error: 'Email is too long' });
            }
            if (!password || typeof password !== 'string') {
                return res.status(400).json({ error: 'Password is required' });
            }
            if (password.length < 8) {
                return res.status(400).json({ error: 'Password must be at least 8 characters' });
            }
            if (password.length > 128) {
                return res.status(400).json({ error: 'Password is too long' });
            }
            if (!/[A-Z]/.test(password)) {
                return res.status(400).json({ error: 'Password must contain an uppercase letter' });
            }
            if (!/[a-z]/.test(password)) {
                return res.status(400).json({ error: 'Password must contain a lowercase letter' });
            }
            if (!/[0-9]/.test(password)) {
                return res.status(400).json({ error: 'Password must contain a number' });
            }
            if (!rawName || typeof rawName !== 'string' || rawName.trim().length < 1) {
                return res.status(400).json({ error: 'Name is required' });
            }
            if (rawName.trim().length > 100) {
                return res.status(400).json({ error: 'Name is too long' });
            }
            const name = rawName.trim()
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#x27;')
                .replace(/\//g, '&#x2F;');
            const existing = await this.db.query('SELECT id FROM users WHERE email = $1', [email.trim().toLowerCase()]);
            if (existing.rows.length > 0) {
                return res.status(409).json({ error: 'Email already registered' });
            }
            const passwordHash = this.auth.hashPassword(password);
            const user = await this.auth.createUser(email.trim().toLowerCase(), name, passwordHash);
            const token = await this.auth.createSession(user.id);
            res.cookie('session', token, {
                httpOnly: true,
                secure: true,
                path: '/',
                maxAge: 30 * 24 * 60 * 60 * 1000,
                sameSite: 'strict',
            });
            return res.status(201).json({ user });
        }
        catch (e) {
            console.error('Signup error:', e);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
    async logout(req, res) {
        const token = getTokenFromCookie(req);
        if (token) {
            await this.auth.deleteSession(token);
        }
        res.cookie('session', '', {
            httpOnly: true,
            secure: true,
            path: '/',
            maxAge: 0,
            sameSite: 'strict',
        });
        return res.json({ ok: true });
    }
    async me(req, res) {
        const token = getTokenFromCookie(req);
        const user = await this.auth.getUserFromToken(token);
        if (!user) {
            return res.json({ user: null });
        }
        return res.json({
            user: { id: user.id, email: user.email, name: user.name },
        });
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('signup'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signup", null);
__decorate([
    (0, common_1.Post)('logout'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
__decorate([
    (0, common_1.Get)('me'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "me", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('api/auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        db_service_1.DbService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map