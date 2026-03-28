import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
export declare class ProjectController {
    private readonly projectService;
    constructor(projectService: ProjectService);
    create(req: any, createProjectDto: CreateProjectDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string;
        fundingGoal: import("@prisma/client-runtime-utils").Decimal;
        currentFunding: import("@prisma/client-runtime-utils").Decimal;
        revenueSharePercent: import("@prisma/client-runtime-utils").Decimal;
        durationMonths: number;
        status: import("@prisma/client").$Enums.ProjectStatus;
        artistId: string;
    }>;
    findAll(): Promise<({
        artist: {
            id: string;
            email: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string;
        fundingGoal: import("@prisma/client-runtime-utils").Decimal;
        currentFunding: import("@prisma/client-runtime-utils").Decimal;
        revenueSharePercent: import("@prisma/client-runtime-utils").Decimal;
        durationMonths: number;
        status: import("@prisma/client").$Enums.ProjectStatus;
        artistId: string;
    })[]>;
    findOne(id: string): Promise<{
        investments: {
            id: string;
            createdAt: Date;
            amount: import("@prisma/client-runtime-utils").Decimal;
            sharePercent: import("@prisma/client-runtime-utils").Decimal;
            projectId: string;
            userId: string;
        }[];
        artist: {
            id: string;
            email: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string;
        fundingGoal: import("@prisma/client-runtime-utils").Decimal;
        currentFunding: import("@prisma/client-runtime-utils").Decimal;
        revenueSharePercent: import("@prisma/client-runtime-utils").Decimal;
        durationMonths: number;
        status: import("@prisma/client").$Enums.ProjectStatus;
        artistId: string;
    }>;
}
