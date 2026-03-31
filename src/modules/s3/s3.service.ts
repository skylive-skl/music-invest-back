import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';

@Injectable()
export class S3Service {
  private readonly s3Client: S3Client;
  private readonly bucketName = process.env.AWS_S3_BUCKET_NAME as string;
  private readonly publicUrl = process.env.R2_PUBLIC_URL as string;

  constructor() {
    this.s3Client = new S3Client({
      region: process.env.AWS_REGION || 'auto',
      endpoint: process.env.AWS_S3_ENDPOINT,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
      },
    });
  }

  async uploadFile(file: Express.Multer.File, folder: 'covers' | 'music'): Promise<string> {
    try {
      const extension = extname(file.originalname);
      const uniqueFilename = `${uuidv4()}${extension}`;
      const key = `${folder}/${uniqueFilename}`; // e.g., covers/123e4567.jpg

      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      });

      await this.s3Client.send(command);

      // Return Cloudflare R2 public URL
      if (this.publicUrl) {
        return `${this.publicUrl.replace(/\/$/, '')}/${key}`;
      }

      // Fallback if no public URL configured
      return `${process.env.AWS_S3_ENDPOINT}/${this.bucketName}/${key}`;
    } catch (error) {
      console.error('Error uploading file to S3 (R2):', error);
      throw new InternalServerErrorException('Could not upload file');
    }
  }
}
