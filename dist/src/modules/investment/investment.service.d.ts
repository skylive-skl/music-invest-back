import { PrismaService } from '../../prisma/prisma.service';
import { CreateInvestmentDto } from './dto/create-investment.dto';
export declare class InvestmentService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    invest(userId: string, dto: CreateInvestmentDto): Promise<{
        id: string;
        createdAt: Date;
        amount: import("@prisma/client-runtime-utils").Decimal;
        sharePercent: import("@prisma/client-runtime-utils").Decimal;
        projectId: string;
        userId: string;
    }>;
    private activateProject;
    handleFailedProjectsCron(): Promise<void>;
    private failAndRefundProject;
    findUserInvestments(userId: string): Promise<({
        project: {
            title: string;
            status: import("@prisma/client").$Enums.ProjectStatus;
        };
    } & {
        id: string;
        createdAt: Date;
        amount: import("@prisma/client-runtime-utils").Decimal;
        sharePercent: import("@prisma/client-runtime-utils").Decimal;
        projectId: string;
        userId: string;
    })[]>;
}
