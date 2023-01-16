import { FileUploadDto } from '@business/common/model';

export interface IFileUploader {
  upload: (files: FileUploadDto[]) => Promise<FileUploadDto[]>;
}
