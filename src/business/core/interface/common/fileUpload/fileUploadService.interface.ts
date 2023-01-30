import { Session } from '@business/auth/model';
import { FileUploadDto } from '@business/common/model';
import { UploadType } from '@core/enums/uploadType.enum';
import { FileUpload } from '@entities/index';

export interface IFileUploadService {
  find(): Promise<FileUploadDto[]>;
  findById(id: string): Promise<FileUploadDto>;
  findByKey(key: string): Promise<FileUploadDto>;
  createMulti(
    fileUpload: FileUploadDto[],
    type: UploadType,
    session: Session,
  ): Promise<FileUploadDto[]>;
  update(_id: string, fileUpload: FileUpload): Promise<boolean>;
  update(_id: string, fileUpload: FileUpload): Promise<boolean>;
  delete(_id: string): Promise<boolean>;
  findByTypeAndUserId(
    userId: string,
    type: UploadType,
    exceptId?: string,
  ): Promise<FileUploadDto[]>;
}
