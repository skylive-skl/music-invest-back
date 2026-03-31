import 'dotenv/config';
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

function generateFullUrl(key: string | null | undefined): string | null {
  if (!key) return null;
  if (key.startsWith('http://') || key.startsWith('https://')) {
    return key;
  }
  const publicUrl = process.env.R2_PUBLIC_URL;
  if (publicUrl) {
    return `${publicUrl.replace(/\/$/, '')}/${key}`;
  }
  const bucketName = process.env.AWS_S3_BUCKET_NAME || '';
  return `${process.env.AWS_S3_ENDPOINT}/${bucketName}/${key}`;
}

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private _extendedClient: any;

  constructor() {
    const connectionString = process.env.DATABASE_URL;
    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);
    super({ adapter });

    this._extendedClient = this.$extends({
      result: {
        project: {
          coverImageUrl: {
            needs: { coverImageUrl: true },
            compute(project) {
              return generateFullUrl(project.coverImageUrl);
            },
          },
        },
        mediaAttachment: {
          url: {
            needs: { url: true },
            compute(media) {
              return generateFullUrl(media.url);
            },
          },
        },
      },
    });
  }

  get extended() {
    return this._extendedClient;
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
