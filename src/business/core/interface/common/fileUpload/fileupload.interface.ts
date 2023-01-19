import { FileUploadDto } from '@business/common/model';

export interface IFileUploader {
  upload: (files: Express.Multer.File[]) => Promise<FileUploadDto[]>;
  get: (path: string) => Promise<any>;
}
