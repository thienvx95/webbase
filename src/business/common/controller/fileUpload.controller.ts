import {
  Action,
  Controller,
  Get,
  Param,
  UseInterceptor,
} from 'routing-controllers';
import { inject, injectable } from 'inversify';
import { RoutingAPI } from '@core/constants';
import {
  ICacheBase,
  IFileUploader,
  IFileUploadService,
} from '@business/core/interface';
import { COMMON_TYPES, SERVICE_TYPES } from '@infrastructures/modules';
import {
  ErrorEnum,
  HttpStatus,
  HttpStatusError,
} from '@core/exception/httpStatusError';
import { isEmpty } from 'lodash';
import { stringFormat } from '@core/ultis';
import { CacheKey } from '@core/enums/cacheKey.enum';

@injectable()
@Controller(RoutingAPI.FileUpload)
//@Authorized([Roles.Admin, Roles.User])
export class FileUploadController {
  constructor(
    @inject(COMMON_TYPES.MemoryCache) private memoryCache: ICacheBase,
    @inject(SERVICE_TYPES.FileUploadService)
    private fileUploadService: IFileUploadService,
    @inject(SERVICE_TYPES.FileUploader) private fileUploader: IFileUploader,
  ) {}

  @Get('/:url(*)')
  @UseInterceptor(function (action: Action, content: any) {
    action.response.set({
      'Content-Type': content.ContentType,
      'Content-Length': content.ContentLength,
      'Cross-Origin-Resource-Policy': 'cross-origin',
    });
    return content?.Body;
  })
  async get(@Param('url') url: string): Promise<any> {
    const fileCache = await this.memoryCache.getAsync(
      stringFormat(CacheKey.GetFile, url),
      async () => {
        return await this.fileUploadService.findByKey(url);
      },
    );
    if (!isEmpty(fileCache)) {
      const file = this.fileUploader.get(url);
      if (file) return file;
    }
    throw new HttpStatusError(HttpStatus.NotFound, ErrorEnum.Not_Found);
  }
}
