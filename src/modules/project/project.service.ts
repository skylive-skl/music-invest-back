import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { PrismaClient } from '@prisma/client';

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
        status: 'FUNDING',
      },
    });
  }

  async findAll() {
    const prisma = this.prisma as unknown as PrismaClient;
    return prisma.project.findMany({
      include: {
        artist: {
          select: { id: true, email: true }
        },
        mediaAttachments: true,
      }
    });
  }

  async findOne(id: string) {
    const prisma = this.prisma as unknown as PrismaClient;
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        artist: { select: { id: true, email: true } },
        investments: true,
        mediaAttachments: true,
      }
    });
    if (!project) throw new NotFoundException('Project not found');
    return project;
  }

  async uploadCover(projectId: string, artistId: string, file: Express.Multer.File) {
    const project = await this.findOne(projectId);
    if (project.artistId !== artistId) throw new BadRequestException('Not project owner');

    const coverImageUrl = `/uploads/${file.filename}`;
    const prisma = this.prisma as unknown as PrismaClient;
    return prisma.project.update({
      where: { id: projectId },
      data: { coverImageUrl },
    });
  }

  async uploadMedia(projectId: string, artistId: string, files: Express.Multer.File[]) {
    const project = await this.findOne(projectId);
    if (project.artistId !== artistId) throw new BadRequestException('Not project owner');

    const mediaRecords = files.map((file) => {
      let type: 'AUDIO' | 'VIDEO' = 'AUDIO';
      if (file.mimetype.startsWith('video/')) {
        type = 'VIDEO';
      }

      return {
        projectId,
        url: `/uploads/${file.filename}`,
        filename: file.originalname,
        type,
      };
    });

    const prisma = this.prisma as unknown as PrismaClient;
    await prisma.mediaAttachment.createMany({
      data: mediaRecords,
    });

    return this.findOne(projectId);
  }
}
