import { Request } from 'express';
import { FileFilterCallback, memoryStorage, Options } from 'multer';

export const fileUploadOptions = (): Options => ({
  storage: memoryStorage(),
  fileFilter: (
    _req: Request,
    file: Express.Multer.File,
    acceptFile: FileFilterCallback,
  ): void => {
    const allowedMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/bmp',
      'image/tiff',
    ];
    acceptFile(null, allowedMimeTypes.includes(file.mimetype));
  },
  limits: {
    fieldNameSize: 255,
    fileSize: 1024 * 1024 * 2,
  },
});
