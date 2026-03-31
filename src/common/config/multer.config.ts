import { memoryStorage } from 'multer';
import { extname } from 'path';
import { HttpException, HttpStatus } from '@nestjs/common';

export const multerOptions = {
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
  },
  fileFilter: (req: any, file: any, cb: any) => {
    // Only allow specific mimetypes
    const allowedMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'audio/mpeg',
      'audio/mp3',
      'audio/wav',
      'audio/x-wav',
      'video/mp4',
      'video/webm',
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new HttpException(`Unsupported file type ${extname(file.originalname)}`, HttpStatus.BAD_REQUEST), false);
    }
  },
  storage: memoryStorage(),
};
