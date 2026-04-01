import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { PrismaClient } from '@prisma/client';
import { S3Service } from '../s3/s3.service';

@Injectable()
export class ProjectService {
  constructor(private prisma: PrismaService, private s3Service: S3Service) { }

  async create(artistId: string, dto: CreateProjectDto) {
    return this.prisma.extended.project.create({
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
    return this.prisma.extended.project.findMany({
      include: {
        artist: {
          select: { id: true, email: true }
        },
        mediaAttachments: true,
      }
    });
  }

  async findOne(id: string) {
    const project = await this.prisma.extended.project.findUnique({
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

    const coverImageUrl = await this.s3Service.uploadFile(file, 'covers');
    return this.prisma.extended.project.update({
      where: { id: projectId },
      data: { coverImageUrl },
    });
  }

  async uploadMedia(projectId: string, artistId: string, files: Express.Multer.File[]) {
    const project = await this.findOne(projectId);
    if (project.artistId !== artistId) throw new BadRequestException('Not project owner');

    const mediaRecords = await Promise.all(
      files.map(async (file) => {
        let type: 'AUDIO' | 'VIDEO' = 'AUDIO';
        if (file.mimetype.startsWith('video/')) {
          type = 'VIDEO';
        }

        const url = await this.s3Service.uploadFile(file, 'tracks');

        return {
          projectId,
          url,
          filename: file.originalname,
          type,
        };
      })
    );

    await this.prisma.extended.mediaAttachment.createMany({
      data: mediaRecords,
    });

    return this.findOne(projectId);
  }
}
