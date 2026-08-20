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
exports.LearnController = void 0;
const common_1 = require("@nestjs/common");
const db_service_1 = require("../db/db.service");
const auth_service_1 = require("../auth/auth.service");
function getTokenFromCookie(req) {
    if (req.cookies?.session)
        return req.cookies.session;
    const cookieHeader = req.headers.cookie || '';
    return cookieHeader.split(';').find((c) => c.trim().startsWith('session='))?.split('=')[1]?.trim();
}
let LearnController = class LearnController {
    db;
    auth;
    constructor(db, auth) {
        this.db = db;
        this.auth = auth;
    }
    async pathData(all, id, res) {
        if (all) {
            const paths = await this.db.getLearningPaths();
            return res.json({ paths });
        }
        const parsedId = parseInt(id || '', 10);
        if (isNaN(parsedId))
            return res.status(400).json({ error: 'Invalid id' });
        const path = await this.db.getLearningPath(parsedId);
        if (!path)
            return res.status(404).json({ error: 'Not found' });
        const steps = await this.db.getLearningSteps(parsedId);
        return res.json({ path, steps });
    }
    async quizData(id, res) {
        const parsedId = parseInt(id || '', 10);
        if (isNaN(parsedId))
            return res.status(400).json({ error: 'Invalid id' });
        const questions = await this.db.getQuizQuestions(parsedId);
        return res.json({ questions });
    }
    async getProgress(req, res) {
        const token = getTokenFromCookie(req);
        const user = await this.auth.getUserFromToken(token);
        if (!user)
            return res.status(401).json({ error: 'Unauthorized' });
        const progress = await this.db.getAllUserProgress(user.id);
        return res.json({ progress });
    }
    async upsertProgress(req, res) {
        const token = getTokenFromCookie(req);
        const user = await this.auth.getUserFromToken(token);
        if (!user)
            return res.status(401).json({ error: 'Unauthorized' });
        const { pathId, stepsCompleted, completed } = req.body || {};
        if (!pathId)
            return res.status(400).json({ error: 'pathId required' });
        const result = await this.db.upsertUserProgress(user.id, pathId, stepsCompleted || [], completed);
        return res.json({ progress: result });
    }
    async submitQuiz(req, res) {
        const token = getTokenFromCookie(req);
        const user = await this.auth.getUserFromToken(token);
        if (!user)
            return res.status(401).json({ error: 'Unauthorized' });
        const { pathId, answers } = req.body || {};
        if (!pathId || !answers)
            return res.status(400).json({ error: 'pathId and answers required' });
        const questions = await this.db.getQuizQuestions(pathId);
        let score = 0;
        const results = questions.map((q, i) => {
            const correct = answers[i] === q.correct_index;
            if (correct)
                score++;
            return { questionId: q.id, correct, correctIndex: q.correct_index, explanation: q.explanation };
        });
        const total = questions.length;
        const passed = score >= Math.ceil(total * 0.7);
        await this.db.submitQuizResult(user.id, pathId, score, total, passed);
        let certificate = null;
        if (passed) {
            const steps = await this.db.getLearningSteps(pathId);
            const allStepIds = steps.map((s) => s.id);
            await this.db.upsertUserProgress(user.id, pathId, allStepIds, true);
            const allProgress = await this.db.getAllUserProgress(user.id);
            const allPaths = await this.db.getLearningPaths();
            const allCompleted = allPaths.every((p) => allProgress.find((pr) => pr.path_id === p.id && pr.completed));
            if (allCompleted) {
                certificate = await this.db.createCertificate(user.id);
            }
        }
        return res.json({ score, total, passed, results });
    }
    async getCertificate(req, res) {
        const token = getTokenFromCookie(req);
        const user = await this.auth.getUserFromToken(token);
        if (!user)
            return res.status(401).json({ error: 'Unauthorized' });
        const cert = await this.db.getCertificate(user.id);
        const allCerts = await this.db.getAllCertificates(user.id);
        return res.json({ certificate: cert, all: allCerts });
    }
    async createCertificate(req, res) {
        const token = getTokenFromCookie(req);
        const user = await this.auth.getUserFromToken(token);
        if (!user)
            return res.status(401).json({ error: 'Unauthorized' });
        const progress = await this.db.getAllUserProgress(user.id);
        const paths = await this.db.getLearningPaths();
        const allCompleted = paths.every((p) => progress.find((pr) => pr.path_id === p.id && pr.completed));
        if (!allCompleted) {
            return res.status(400).json({ error: 'Complete all learning paths first' });
        }
        const existing = await this.db.getCertificate(user.id);
        if (existing)
            return res.json({ certificate: existing });
        const cert = await this.db.createCertificate(user.id);
        return res.json({ certificate: cert });
    }
};
exports.LearnController = LearnController;
__decorate([
    (0, common_1.Get)('path-data'),
    __param(0, (0, common_1.Query)('all')),
    __param(1, (0, common_1.Query)('id')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], LearnController.prototype, "pathData", null);
__decorate([
    (0, common_1.Get)('quiz-data'),
    __param(0, (0, common_1.Query)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], LearnController.prototype, "quizData", null);
__decorate([
    (0, common_1.Get)('progress'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], LearnController.prototype, "getProgress", null);
__decorate([
    (0, common_1.Post)('progress'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], LearnController.prototype, "upsertProgress", null);
__decorate([
    (0, common_1.Post)('quiz'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], LearnController.prototype, "submitQuiz", null);
__decorate([
    (0, common_1.Get)('certificate'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], LearnController.prototype, "getCertificate", null);
__decorate([
    (0, common_1.Post)('certificate'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], LearnController.prototype, "createCertificate", null);
exports.LearnController = LearnController = __decorate([
    (0, common_1.Controller)('api/learn'),
    __metadata("design:paramtypes", [db_service_1.DbService,
        auth_service_1.AuthService])
], LearnController);
//# sourceMappingURL=learn.controller.js.map