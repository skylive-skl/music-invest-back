import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { S3Service } from '../s3/s3.service';

@Injectable()
export class TrackService {
  constructor(private prisma: PrismaService, private s3Service: S3Service) {}

  async create(artistId: string, dto: CreateTrackDto) {
    const album = await this.prisma.extended.album.findUnique({ where: { id: dto.albumId } });
    if (!album) throw new NotFoundException('Album not found');
    if (album.artistId !== artistId) throw new BadRequestException('Not album owner');

    return this.prisma.extended.track.create({
      data: {
        artistId,
        albumId: dto.albumId,
        title: dto.title,
        audioUrl: '', // will be populated on upload
      },
    });
  }

  async findAll() {
    return this.prisma.extended.track.findMany();
  }

  async findOne(id: string) {
    const track = await this.prisma.extended.track.findUnique({
      where: { id },
      include: {
        album: { select: { id: true, title: true } },
        artist: { select: { id: true, email: true } },
      }
    });
    if (!track) throw new NotFoundException('Track not found');
    return track;
  }

  async uploadAudio(trackId: string, artistId: string, file: Express.Multer.File) {
    const track = await this.findOne(trackId);
    if (track.artistId !== artistId) throw new BadRequestException('Not track owner');

    if (!file.mimetype.startsWith('audio/')) {
      throw new BadRequestException('Only audio files are allowed');
    }

    let durationInSeconds = 0;
    try {
      const mm = await import('music-metadata');
      const metadata = await mm.parseBuffer(file.buffer, file.mimetype);
      if (metadata.format && metadata.format.duration) {
        durationInSeconds = Math.round(metadata.format.duration);
      }
    } catch (e) {
      console.warn('Could not parse audio duration:', e);
    }

    const audioUrl = await this.s3Service.uploadFile(file, 'tracks');
    return this.prisma.extended.track.update({
      where: { id: trackId },
      data: { 
        audioUrl,
        duration: durationInSeconds
      },
    });
  }
}
