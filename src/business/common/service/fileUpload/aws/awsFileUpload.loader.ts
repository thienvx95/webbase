import { HttpStatusError, HttpStatus, ErrorEnum } from "@core/exception/httpStatusError";
import { GlobalConfigInstance } from "aws-sdk/lib/config";
import * as S3 from "aws-sdk/clients/s3"; 
import { isEmpty } from "lodash";
import { SystemConfig } from "@core/configuration";
import { FileUploadDto } from "@business/common/model";
import { inject, injectable } from "inversify";
import { SERVICE_TYPES } from "@infrastructures/modules";
import { IFileUploader, IFileUploadService } from "@business/core/interface";

@injectable()
export class AWSFileUploadSerivce implements IFileUploader {
  private client: S3;
  private awsConfig: GlobalConfigInstance;
  private readonly _configs = SystemConfig.Configs;
  private _bucketName;

  constructor(
    @inject(SERVICE_TYPES.FileUploadService) private fileUploadService: IFileUploadService
  ) {
    this.awsConfig.update({
      accessKeyId: this._configs.S3Config.AWSAccessKeyId,
      secretAccessKey: this._configs.S3Config.AWSSecretAccessKey,
      region: this._configs.S3Config.DefaultRegion
    })

    this.client = new S3({
      region: this._configs.S3Config.DefaultRegion,
    });
    this._bucketName = this._configs.S3Config.BucketName;
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

        this.fileUploadService.createMulti(result);
        return result;
      }
      return [];
    } catch {
      throw new HttpStatusError(HttpStatus.BadRequest, ErrorEnum.Error_Upload_Files);
    }
  };
}