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
exports.ProgressController = void 0;
const common_1 = require("@nestjs/common");
const db_service_1 = require("../db/db.service");
const auth_service_1 = require("../auth/auth.service");
function getTokenFromCookie(req) {
    if (req.cookies?.session)
        return req.cookies.session;
    const cookieHeader = req.headers.cookie || '';
    return cookieHeader.split(';').find((c) => c.trim().startsWith('session='))?.split('=')[1]?.trim();
}
let ProgressController = class ProgressController {
    db;
    auth;
    constructor(db, auth) {
        this.db = db;
        this.auth = auth;
    }
    async upsert(req, res) {
        const token = getTokenFromCookie(req);
        const user = await this.auth.getUserFromToken(token);
        if (!user)
            return res.status(401).json({ error: 'Unauthorized' });
        const { content_block_id, checked } = req.body || {};
        if (typeof content_block_id !== 'number' || typeof checked !== 'boolean') {
            return res.status(400).json({ error: 'Invalid request body' });
        }
        await this.db.upsertChecklistProgress(user.id, content_block_id, checked);
        return res.json({ ok: true });
    }
    async get(req, res) {
        const token = getTokenFromCookie(req);
        const user = await this.auth.getUserFromToken(token);
        if (!user)
            return res.json({ progress: [] });
        const progress = await this.db.getChecklistProgress(user.id);
        return res.json({ progress });
    }
};
exports.ProgressController = ProgressController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ProgressController.prototype, "upsert", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ProgressController.prototype, "get", null);
exports.ProgressController = ProgressController = __decorate([
    (0, common_1.Controller)('api/progress'),
    __metadata("design:paramtypes", [db_service_1.DbService,
        auth_service_1.AuthService])
], ProgressController);
//# sourceMappingURL=progress.controller.js.map