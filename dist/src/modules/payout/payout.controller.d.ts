import { PayoutService } from './payout.service';
import { CreateRevenueReportDto } from './dto/create-revenue-report.dto';
export declare class PayoutController {
    private readonly payoutService;
    constructor(payoutService: PayoutService);
    submitRevenue(req: any, dto: CreateRevenueReportDto): Promise<{
        id: string;
        createdAt: Date;
        amount: import("@prisma/client-runtime-utils").Decimal;
        projectId: string;
        periodStart: Date;
        periodEnd: Date;
    }>;
    getPayoutHistory(req: any): Promise<({
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
