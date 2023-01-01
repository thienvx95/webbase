import { HttpStatusError, HttpStatus, ErrorEnum } from "@core/exception/httpStatusError";
import S3 from "aws-sdk/clients/s3";
import isEmpty from "lodash/isEmpty";
import { IFileUploadService } from "../fileUpload.service";
import { SystemConfig } from "@core/configuration";
import { IFileUploader } from "../fileupload.interface";
import { FileUploadDto } from "@business/common/model";
import { injectable } from "inversify";

@injectable()
export class AWSFileUploadSerivce implements IFileUploader {
  private client: S3;
  private readonly _configs = SystemConfig.Configs;
  private _bucketName;

  constructor(
    private FileUploadService: IFileUploadService,
  ) {
    this.client = new S3({
      region: this._configs.S3Config.DefaultRegion,
    });
    this._bucketName = this._configs.S3Config.BucketName ;
  }

  private generateFileKey(file: FileUploadDto, timestamp: number): string {
    return `${file.name}-${timestamp}.${file.extension}`;
  }

  private async uploadFile(file: FileUploadDto): Promise<FileUploadDto> {
    const timestamp = Date.now();
    const fileKey = this.generateFileKey(file, timestamp);
    await this.client
      .putObject({
        Bucket: this._bucketName,
        Key: fileKey,
        ContentType: file.type,
        Body: file.content,
        ACL:this._configs.S3Config.DefaultFilesACL,
      })
      .promise();
   
    return file;
  }

  upload = async (files: FileUploadDto[]): Promise<FileUploadDto[]> => {
    try {
      if (Array.isArray(files)) {
        const result: FileUploadDto[] = await Promise.all(
          files.map(async (file) => this.uploadFile(file))
        );

        if(isEmpty(result)){
          throw new HttpStatusError(HttpStatus.BadRequest, ErrorEnum.Error_Upload_Files);
        }

        this.FileUploadService.createMulti(result);
        return result;
      }
      return [];
    } catch {
      throw new HttpStatusError(HttpStatus.BadRequest, ErrorEnum.Error_Upload_Files);
    }
  };
}