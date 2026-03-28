import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';

@Injectable()
export class ProjectService {
  constructor(private prisma: PrismaService) {}

  async create(artistId: string, dto: CreateProjectDto) {
    return this.prisma.project.create({
      data: {
        artistId,
        title: dto.title,
        description: dto.description,
        fundingGoal: dto.fundingGoal,
        revenueSharePercent: dto.revenueSharePercent,
        durationMonths: dto.durationMonths,
        status: 'FUNDING', // Automatically move to FUNDING or DRAFT depending on flow. Using FUNDING.
      },
    });
  }

  async findAll() {
    return this.prisma.project.findMany({
      include: {
        artist: {
          select: { id: true, email: true }
        }
      }
    });
  }

  async findOne(id: string) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: {
        artist: { select: { id: true, email: true } },
        investments: true,
      }
    });
    if (!project) throw new NotFoundException('Project not found');
    return project;
  }
}
