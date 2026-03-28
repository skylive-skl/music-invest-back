import { PrismaService } from '../../prisma/prisma.service';
import { CreateRevenueReportDto } from './dto/create-revenue-report.dto';
export declare class PayoutService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    submitRevenue(artistId: string, dto: CreateRevenueReportDto): Promise<{
        id: string;
        createdAt: Date;
        amount: import("@prisma/client-runtime-utils").Decimal;
        projectId: string;
        periodStart: Date;
        periodEnd: Date;
    }>;
    getPayoutHistory(userId: string): Promise<({
        revenueReport: {
            project: {
                title: string;
            };
        } & {
            id: string;
            createdAt: Date;
            amount: import("@prisma/client-runtime-utils").Decimal;
            projectId: string;
            periodStart: Date;
            periodEnd: Date;
        };
    } & {
        id: string;
        createdAt: Date;
        amount: import("@prisma/client-runtime-utils").Decimal;
        userId: string;
        revenueReportId: string;
    })[]>;
}
