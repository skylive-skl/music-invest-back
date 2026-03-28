import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('password123', salt);

  // Users
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

  // Project
  const project = await prisma.project.create({
    data: {
      artistId: artist.id,
      title: 'Album: Neon Nights',
      description: 'A retro-wave synth pop album.',
      fundingGoal: 5000,
      currentFunding: 0,
      revenueSharePercent: 50, // 50%
      durationMonths: 6,
      status: 'FUNDING',
    },
  });

  // Example Investments
  // Let's fully fund the project
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

  // Since it reached funding goal, activate the project and assign shares
  await prisma.project.update({
    where: { id: project.id },
    data: {
      status: 'ACTIVE',
      currentFunding: 5000,
    },
  });

  await prisma.investment.update({
    where: { id: inv1.id },
    data: { sharePercent: (2500 / 5000) * 50 }, // 25%
  });

  await prisma.investment.update({
    where: { id: inv2.id },
    data: { sharePercent: (2500 / 5000) * 50 }, // 25%
  });

  // Revenue Distribution (Artist reports $10,000 revenue)
  const reportAmount = 10000;
  const report = await prisma.revenueReport.create({
    data: {
      projectId: project.id,
      amount: reportAmount,
      periodStart: new Date('2023-01-01'),
      periodEnd: new Date('2023-01-31'),
    },
  });

  // Payout Calculation
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
