import { Session } from '@business/auth/model';
import { FileUploadDto } from '@business/common/model';
import { UploadType } from '@core/enums/uploadType.enum';

export interface IFileUploader {
  upload: (
    files: Express.Multer.File[],
    type: UploadType,
    session: Session,
  ) => Promise<FileUploadDto[]>;
  get: (path: string) => Promise<any>;
  delete: (path: string) => Promise<boolean>;
  deleteByTypeAndUserId: (
    userId: string,
    type: UploadType,
    exceptId?: string,
  ) => Promise<void>;
}
