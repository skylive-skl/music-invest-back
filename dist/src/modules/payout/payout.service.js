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
var PayoutService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayoutService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let PayoutService = PayoutService_1 = class PayoutService {
    prisma;
    logger = new common_1.Logger(PayoutService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async submitRevenue(artistId, dto) {
        const prisma = this.prisma;
        return prisma.$transaction(async (tx) => {
            const project = await tx.project.findUnique({
                where: { id: dto.projectId },
            });
            if (!project)
                throw new common_1.NotFoundException('Project not found');
            if (project.artistId !== artistId)
                throw new common_1.BadRequestException('Not project owner');
            if (project.status !== 'ACTIVE')
                throw new common_1.BadRequestException('Project is not active');
            const report = await tx.revenueReport.create({
                data: {
                    projectId: project.id,
                    amount: dto.amount,
                    periodStart: new Date(dto.periodStart),
                    periodEnd: new Date(dto.periodEnd),
                },
            });
            const investments = await tx.investment.findMany({
                where: { projectId: project.id },
            });
            let payoutRecords = [];
            for (const inv of investments) {
                const payoutAmount = (Number(dto.amount) * Number(inv.sharePercent)) / 100;
                if (payoutAmount > 0) {
                    const payout = await tx.payout.create({
                        data: {
                            revenueReportId: report.id,
                            userId: inv.userId,
                            amount: payoutAmount,
                        },
                    });
                    payoutRecords.push(payout);
                    await tx.user.update({
                        where: { id: inv.userId },
                        data: { balance: { increment: payoutAmount } },
                    });
                }
            }
            this.logger.log(`Revenue report ${report.id} created and distributed to ${payoutRecords.length} investors.`);
            return report;
        });
    }
    async getPayoutHistory(userId) {
        const prisma = this.prisma;
        return prisma.payout.findMany({
            where: { userId },
            include: {
                revenueReport: {
                    include: { project: { select: { title: true } } }
                }
            }
        });
    }
};
exports.PayoutService = PayoutService;
exports.PayoutService = PayoutService = PayoutService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PayoutService);
//# sourceMappingURL=payout.service.js.map