import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateInvestmentDto } from './dto/create-investment.dto';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class InvestmentService {
  private readonly logger = new Logger(InvestmentService.name);

  constructor(private prisma: PrismaService) {}

  async invest(userId: string, dto: CreateInvestmentDto) {
    return this.prisma.$transaction(async (tx) => {
      const project = await tx.project.findUnique({
        where: { id: dto.projectId },
        include: { investments: true },
      });

      if (!project) throw new BadRequestException('Project not found');
      if (project.status !== 'FUNDING') throw new BadRequestException('Project is not open for funding');

      // Update funding
      const newFunding = Number(project.currentFunding) + dto.amount;

      if (newFunding > Number(project.fundingGoal)) {
        throw new BadRequestException('Investment exceeds funding goal');
      }

      // Create investment
      const investment = await tx.investment.create({
        data: {
          projectId: project.id,
          userId,
          amount: dto.amount,
        },
      });

      // Update project currentFunding
      await tx.project.update({
        where: { id: project.id },
        data: { currentFunding: newFunding },
      });

      // Check if project is fully funded
      if (newFunding === Number(project.fundingGoal)) {
        await this.activateProject(tx, project.id, newFunding, Number(project.revenueSharePercent));
      }

      return investment;
    });
  }

  private async activateProject(tx: any, projectId: string, fundingGoal: number, revenueSharePercent: number) {
    // 1. Mark project as ACTIVE
    await tx.project.update({
      where: { id: projectId },
      data: { status: 'ACTIVE' },
    });

    // 2. Compute and set sharePercent for all investments
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

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
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

  private async failAndRefundProject(projectId: string) {
    await this.prisma.$transaction(async (tx) => {
      // Mark as FAILED
      await tx.project.update({
        where: { id: projectId },
        data: { status: 'FAILED' },
      });

      const investments = await tx.investment.findMany({ where: { projectId } });

      for (const inv of investments) {
        // Refund user balance
        await tx.user.update({
          where: { id: inv.userId },
          data: { balance: { increment: inv.amount } },
        });
      }

      this.logger.log(`Project ${projectId} failed. Issued refunds to ${investments.length} investors.`);
    });
  }

  async findUserInvestments(userId: string) {
    return this.prisma.investment.findMany({
      where: { userId },
      include: {
        project: {
          select: { title: true, status: true }
        }
      }
    });
  }
}
