"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const client_1 = require("@prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const pg_1 = require("pg");
const bcrypt = __importStar(require("bcrypt"));
const connectionString = process.env.DATABASE_URL;
const pool = new pg_1.Pool({ connectionString });
const adapter = new adapter_pg_1.PrismaPg(pool);
const prisma = new client_1.PrismaClient({ adapter });
async function main() {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('password123', salt);
    const artist = await prisma.user.upsert({
        where: { email: 'artist@example.com' },
        update: {},
        create: {
            email: 'artist@example.com',
            passwordHash,
            role: 'ARTIST',
        },
    });
    const investor1 = await prisma.user.upsert({
        where: { email: 'investor1@example.com' },
        update: {},
        create: {
            email: 'investor1@example.com',
            passwordHash,
            role: 'USER',
            balance: 1000,
        },
    });
    const investor2 = await prisma.user.upsert({
        where: { email: 'investor2@example.com' },
        update: {},
        create: {
            email: 'investor2@example.com',
            passwordHash,
            role: 'USER',
            balance: 2000,
        },
    });
    const project = await prisma.project.create({
        data: {
            artistId: artist.id,
            title: 'Album: Neon Nights',
            description: 'A retro-wave synth pop album.',
            fundingGoal: 5000,
            currentFunding: 0,
            revenueSharePercent: 50,
            durationMonths: 6,
            status: 'FUNDING',
        },
    });
    const inv1 = await prisma.investment.create({
        data: {
            projectId: project.id,
            userId: investor1.id,
            amount: 2500,
        },
    });
    const inv2 = await prisma.investment.create({
        data: {
            projectId: project.id,
            userId: investor2.id,
            amount: 2500,
        },
    });
    await prisma.project.update({
        where: { id: project.id },
        data: {
            status: 'ACTIVE',
            currentFunding: 5000,
        },
    });
    await prisma.investment.update({
        where: { id: inv1.id },
        data: { sharePercent: (2500 / 5000) * 50 },
    });
    await prisma.investment.update({
        where: { id: inv2.id },
        data: { sharePercent: (2500 / 5000) * 50 },
    });
    const reportAmount = 10000;
    const report = await prisma.revenueReport.create({
        data: {
            projectId: project.id,
            amount: reportAmount,
            periodStart: new Date('2023-01-01'),
            periodEnd: new Date('2023-01-31'),
        },
    });
    const investments = await prisma.investment.findMany({ where: { projectId: project.id } });
    for (const inv of investments) {
        const payoutAmount = (reportAmount * Number(inv.sharePercent)) / 100;
        await prisma.payout.create({
            data: {
                revenueReportId: report.id,
                userId: inv.userId,
                amount: payoutAmount,
            },
        });
        await prisma.user.update({
            where: { id: inv.userId },
            data: { balance: { increment: payoutAmount } },
        });
    }
    console.log('Seed completed successfully!');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map