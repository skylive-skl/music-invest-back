import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateRevenueReportDto } from './dto/create-revenue-report.dto';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PayoutService {
  private readonly logger = new Logger(PayoutService.name);

  constructor(private prisma: PrismaService) {}

  async submitRevenue(artistId: string, dto: CreateRevenueReportDto) {
    const prisma = this.prisma as unknown as PrismaClient; // Fix typings locally
    return prisma.$transaction(async (tx) => {
      // Find project, check owner
      const project = await tx.project.findUnique({
        where: { id: dto.projectId },
      });

      if (!project) throw new NotFoundException('Project not found');
      if (project.artistId !== artistId) throw new BadRequestException('Not project owner');
      if (project.status !== 'ACTIVE') throw new BadRequestException('Project is not active');

      // Create revenue report
      const report = await tx.revenueReport.create({
        data: {
          projectId: project.id,
          amount: dto.amount,
          periodStart: new Date(dto.periodStart),
          periodEnd: new Date(dto.periodEnd),
        },
      });

      // Distribute to all investors
      const investments = await tx.investment.findMany({
        where: { projectId: project.id },
      });

      let payoutRecords = [];
      for (const inv of investments) {
        // user_payout = revenue_report.amount * (inv.sharePercent / 100)
        // Note: sharePercent is stored as exact decimal e.g. 50 meaning 50%.
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

           // update user wallet balance
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

  async getPayoutHistory(userId: string) {
    const prisma = this.prisma as unknown as PrismaClient;
    return prisma.payout.findMany({
      where: { userId },
      include: {
        revenueReport: {
          include: { project: { select: { title: true } } }
        }
      }
    });
  }
}
