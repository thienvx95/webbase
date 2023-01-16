import { FileUploadDto } from "@business/common/model";
import { FileUpload } from "@entities/index";

export interface IFileUploadService {
    find(): Promise<FileUploadDto[]>;
    findById(id: string): Promise<FileUploadDto>;
    createMulti(fileUpload: FileUploadDto[]): Promise<FileUploadDto[]>;
    update(_id: string, fileUpload: FileUpload): Promise<boolean>;
    update(_id: string, fileUpload: FileUpload): Promise<boolean>;
    delete(_id: string): Promise<boolean>;
  }
  