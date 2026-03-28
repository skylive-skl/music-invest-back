import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';
import { HttpException, HttpStatus } from '@nestjs/common';

export const multerOptions = {
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
  },
  fileFilter: (req: any, file: any, cb: any) => {
    // Only allow specific mimetypes
    if (file.mimetype.match(/\/(jpg|jpeg|png|gif|mp3|wav|mp4|webm)$/)) {
      cb(null, true);
    } else {
      cb(new HttpException(`Unsupported file type ${extname(file.originalname)}`, HttpStatus.BAD_REQUEST), false);
    }
  },
  storage: diskStorage({
    destination: (req: any, file: any, cb: any) => {
      const uploadPath = './uploads';
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }
      cb(null, uploadPath);
    },
    filename: (req: any, file: any, cb: any) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = extname(file.originalname);
      cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
    },
  }),
};
