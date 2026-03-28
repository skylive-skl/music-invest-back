import { UserService } from './user.service';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    findAll(): Promise<{
        id: string;
        email: string;
        passwordHash: string;
        role: import("@prisma/client").$Enums.Role;
        balance: import("@prisma/client-runtime-utils").Decimal;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    getProfile(req: any): Promise<{
        id: string;
        email: string;
        role: import("@prisma/client").$Enums.Role;
        balance: import("@prisma/client-runtime-utils").Decimal;
        createdAt: Date;
    }>;
    getWallet(req: any): Promise<{
        balance: import("@prisma/client-runtime-utils").Decimal;
    }>;
}
