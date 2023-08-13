import {
  HttpStatusError,
  HttpStatus,
  ErrorEnum,
} from '@core/exception/httpStatusError';
import * as AWS from 'aws-sdk';
import { isEmpty } from 'lodash';
import { SystemConfig } from '@core/configuration';
import { FileUploadDto } from '@business/common/model';
import { inject, injectable } from 'inversify';
import { SERVICE_TYPES } from '@infrastructures/modules';
import { IFileUploader, IFileUploadService } from '@business/core/interface';
import { Logging } from '@core/log';
import * as moment from 'moment';
import { StorageProvider } from '@core/enums/storageProvider.enum';
import * as path from 'path';
import { Session } from '@business/auth/model';
import { UploadType } from '@core/enums/uploadType.enum';

@injectable()
export class AWSFileUploadSerivce implements IFileUploader {
  private Logging = Logging.getInstance('AWSFileUploadSerivce');
  private client: AWS.S3;
  private readonly _configs = SystemConfig.Configs;
  private _bucketName;

  constructor(
    @inject(SERVICE_TYPES.FileUploadService)
    private fileUploadService: IFileUploadService,
  ) {
    AWS.config.update({
      accessKeyId: this._configs.S3Config.AWSAccessKeyId,
      secretAccessKey: this._configs.S3Config.AWSSecretAccessKey,
      region: this._configs.S3Config.DefaultRegion,
    });

    this.client = new AWS.S3({
      region: this._configs.S3Config.DefaultRegion,
    });
    this._bucketName = this._configs.S3Config.BucketName;
  }
  delete = async (path: string): Promise<any> => {
    try {
      const result = await this.client
        .deleteObject({
          Bucket: this._bucketName,
          Key: path,
        })
        .promise();
      return result;
    } catch (e) {
      this.Logging.error(`Path: ${path} - Error: ${e.message}`, 'AWSGet');
      return null;
    }
  };
  deleteByTypeAndUserId = async (
    userId: string,
    type: UploadType,
    exceptId?: string,
  ): Promise<void> => {
    const deleteFiles = await this.fileUploadService.findByTypeAndUserId(
      userId,
      type,
      exceptId,
    );
    if (!isEmpty(deleteFiles)) {
      for await (const file of deleteFiles) {
        await this.delete(file.path);
        await this.fileUploadService.delete(file._id);
      }
    }
  };
  get = async (path: string): Promise<any> => {
    try {
      const result = await this.client
        .getObject({
          Bucket: this._bucketName,
          Key: path,
        })
        .promise();
      return result;
    } catch (e) {
      this.Logging.error(`Path: ${path} - Error: ${e.message}`, 'AWSGet');
      return null;
    }
  };

  private generateFileKey(
    file: Express.Multer.File,
    timestamp: number,
  ): string {
    const utcMoment = moment.utc();
    return `${utcMoment.year()}/${
      utcMoment.month() + 1
    }/${utcMoment.date()}/${timestamp}${path.extname(file.originalname)}`;
  }

  private async uploadFile(file: Express.Multer.File): Promise<FileUploadDto> {
    const timestamp = Date.now();
    const fileKey = this.generateFileKey(file, timestamp);
    await this.client
      .putObject({
        Bucket: this._bucketName,
        Key: fileKey,
        ContentType: file.mimetype,
        Body: file.buffer,
      })
      .promise();

    return {
      size: file.size,
      extension: path.extname(file.originalname),
      name: file.originalname.split('.').slice(0, -1).join('.'),
      path: fileKey,
      type:
        file.mimetype.split('/') && file.mimetype.split('/').length
          ? file.mimetype.split('/')[0]
          : '',
      storage: StorageProvider.S3,
    } as FileUploadDto;
  }

  upload = async (
    files: Express.Multer.File[],
    type: UploadType,
    session: Session,
  ): Promise<FileUploadDto[]> => {
    try {
      if (Array.isArray(files)) {
        let result: FileUploadDto[] = await Promise.all(
          files.map(async (file) => this.uploadFile(file)),
        );
        if (isEmpty(result)) {
          throw new HttpStatusError(
            HttpStatus.BadRequest,
            ErrorEnum.Error_Upload_Files,
          );
        }

        result = await this.fileUploadService.createMulti(
          result,
          type,
          session,
        );
        return result;
      }
      return [];
    } catch (e) {
      this.Logging.error(`${e.message} - ${e.stack}`, 'AWSUpload');
      throw new HttpStatusError(
        HttpStatus.BadRequest,
        ErrorEnum.Error_Upload_Files,
      );
    }
  };
}
