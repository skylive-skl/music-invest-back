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
var InvestmentService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvestmentService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const schedule_1 = require("@nestjs/schedule");
let InvestmentService = InvestmentService_1 = class InvestmentService {
    prisma;
    logger = new common_1.Logger(InvestmentService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async invest(userId, dto) {
        return this.prisma.$transaction(async (tx) => {
            const project = await tx.project.findUnique({
                where: { id: dto.projectId },
                include: { investments: true },
            });
            if (!project)
                throw new common_1.BadRequestException('Project not found');
            if (project.status !== 'FUNDING')
                throw new common_1.BadRequestException('Project is not open for funding');
            const newFunding = Number(project.currentFunding) + dto.amount;
            if (newFunding > Number(project.fundingGoal)) {
                throw new common_1.BadRequestException('Investment exceeds funding goal');
            }
            const investment = await tx.investment.create({
                data: {
                    projectId: project.id,
                    userId,
                    amount: dto.amount,
                },
            });
            await tx.project.update({
                where: { id: project.id },
                data: { currentFunding: newFunding },
            });
            if (newFunding === Number(project.fundingGoal)) {
                await this.activateProject(tx, project.id, newFunding, Number(project.revenueSharePercent));
            }
            return investment;
        });
    }
    async activateProject(tx, projectId, fundingGoal, revenueSharePercent) {
        await tx.project.update({
            where: { id: projectId },
            data: { status: 'ACTIVE' },
        });
        const investments = await tx.investment.findMany({ where: { projectId } });
        for (const inv of investments) {
            const share = (Number(inv.amount) / fundingGoal) * revenueSharePercent;
            await tx.investment.update({
                where: { id: inv.id },
                data: { sharePercent: share },
            });
        }
        this.logger.log(`Project ${projectId} activated successfully. Shares distributed.`);
    }
    async handleFailedProjectsCron() {
        this.logger.log('Running daily cron job for expired projects...');
        const fundingProjects = await this.prisma.project.findMany({
            where: { status: 'FUNDING' },
        });
        const now = new Date();
        for (const project of fundingProjects) {
            const deadline = new Date(project.createdAt);
            deadline.setMonth(deadline.getMonth() + project.durationMonths);
            if (now > deadline) {
                await this.failAndRefundProject(project.id);
            }
        }
    }
    async failAndRefundProject(projectId) {
        await this.prisma.$transaction(async (tx) => {
            await tx.project.update({
                where: { id: projectId },
                data: { status: 'FAILED' },
            });
            const investments = await tx.investment.findMany({ where: { projectId } });
            for (const inv of investments) {
                await tx.user.update({
                    where: { id: inv.userId },
                    data: { balance: { increment: inv.amount } },
                });
            }
            this.logger.log(`Project ${projectId} failed. Issued refunds to ${investments.length} investors.`);
        });
    }
    async findUserInvestments(userId) {
        return this.prisma.investment.findMany({
            where: { userId },
            include: {
                project: {
                    select: { title: true, status: true }
                }
            }
        });
    }
};
exports.InvestmentService = InvestmentService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_MIDNIGHT),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InvestmentService.prototype, "handleFailedProjectsCron", null);
exports.InvestmentService = InvestmentService = InvestmentService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], InvestmentService);
//# sourceMappingURL=investment.service.js.map