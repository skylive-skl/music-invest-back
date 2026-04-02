import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SearchService {
  constructor(private prisma: PrismaService) {}

  async search(query: string, types: string[]) {
    const q = query.trim();
    const mode = 'insensitive' as const;

    const [tracks, albums, artists, projects] = await Promise.all([
      types.includes('track')
        ? this.prisma.extended.track.findMany({
            where: {
              OR: [
                { title: { contains: q, mode } },
                { artist: { email: { contains: q, mode } } },
              ],
            },
            include: {
              artist: { select: { id: true, email: true } },
              album: { select: { id: true, title: true } },
            },
            take: 20,
          })
        : [],

      types.includes('album')
        ? this.prisma.extended.album.findMany({
            where: {
              OR: [
                { title: { contains: q, mode } },
                { artist: { email: { contains: q, mode } } },
              ],
            },
            include: {
              artist: { select: { id: true, email: true } },
              _count: { select: { tracks: true } },
            },
            take: 20,
          })
        : [],

      types.includes('artist')
        ? this.prisma.extended.user.findMany({
            where: {
              role: 'ARTIST',
              email: { contains: q, mode },
            },
            select: {
              id: true,
              email: true,
              createdAt: true,
              _count: { select: { albums: true, tracks: true } },
            },
            take: 20,
          })
        : [],

      types.includes('project')
        ? this.prisma.extended.project.findMany({
            where: {
              OR: [
                { title: { contains: q, mode } },
                { description: { contains: q, mode } },
                { artist: { email: { contains: q, mode } } },
              ],
            },
            include: {
              artist: { select: { id: true, email: true } },
            },
            take: 20,
          })
        : [],
    ]);

    return { tracks, albums, artists, projects };
  }
}
