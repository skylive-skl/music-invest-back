import { InvestmentService } from './investment.service';
import { CreateInvestmentDto } from './dto/create-investment.dto';
export declare class InvestmentController {
    private readonly investmentService;
    constructor(investmentService: InvestmentService);
    invest(req: any, createInvestmentDto: CreateInvestmentDto): Promise<{
        id: string;
        createdAt: Date;
        amount: import("@prisma/client-runtime-utils").Decimal;
        sharePercent: import("@prisma/client-runtime-utils").Decimal;
        projectId: string;
        userId: string;
    }>;
    getMyInvestments(req: any): Promise<({
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
