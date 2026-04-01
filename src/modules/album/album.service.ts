import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { S3Service } from '../s3/s3.service';

@Injectable()
export class AlbumService {
  constructor(private prisma: PrismaService, private s3Service: S3Service) {}

  async create(artistId: string, dto: CreateAlbumDto) {
    return this.prisma.extended.album.create({
      data: {
        artistId,
        title: dto.title,
      },
    });
  }

  async findAll() {
    return this.prisma.extended.album.findMany({
      include: {
        artist: {
          select: { id: true, email: true }
        },
        tracks: true,
      }
    });
  }

  async findOne(id: string) {
    const album = await this.prisma.extended.album.findUnique({
      where: { id },
      include: {
        artist: { select: { id: true, email: true } },
        tracks: true,
      }
    });
    if (!album) throw new NotFoundException('Album not found');
    return album;
  }

  async uploadCover(albumId: string, artistId: string, file: Express.Multer.File) {
    const album = await this.findOne(albumId);
    if (album.artistId !== artistId) throw new BadRequestException('Not album owner');

    if (!file.mimetype.startsWith('image/')) {
      throw new BadRequestException('Only image files are allowed for album cover');
    }

    const coverImageUrl = await this.s3Service.uploadFile(file, 'covers');
    return this.prisma.extended.album.update({
      where: { id: albumId },
      data: { coverImageUrl },
    });
  }
}
