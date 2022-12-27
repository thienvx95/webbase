import { Service } from 'typedi';

import {
  EventDispatcher,
  IEventDispatcher,
  Repository,
  IRepository,
  AutoMapperDecorator,
  IAutoMapper
} from '@infrastructures/decorators';
import { events } from '@infrastructures/events';
import { isEmpty } from 'lodash';
import { FileUpload } from '@entities/index';
import { Logging } from '@core/log';
import { FileUploadDto } from '@business/common/model';

export interface IFileUploadService {
  find(): Promise<FileUploadDto[]>;
  findById(id: string): Promise<FileUploadDto>;
  createMulti(fileUpload: FileUploadDto[]): Promise<FileUploadDto[]>;
  update(_id: string, fileUpload: FileUpload): Promise<boolean>;
  update(_id: string, fileUpload: FileUpload): Promise<boolean>;
  delete(_id: string): Promise<boolean>;
}

@Service()
export class FileUploadService implements IFileUploadService {
    private log = Logging.getInstance('FileUploadService');
  constructor(
    @Repository() private fileUploadRepository: IRepository<FileUpload>,
    @EventDispatcher() private eventDispatcher: IEventDispatcher,
    @AutoMapperDecorator() private autoMapper: IAutoMapper,
  ) {}

  async find(): Promise<FileUploadDto[]> {
    this.log.info('Find all FileUploads');
    const models = await this.fileUploadRepository.find({});
    return !isEmpty(models) ? this.autoMapper.MapArray(models, FileUpload, FileUploadDto) : [];
  }

  async findById(id: string): Promise<FileUploadDto> {
    this.log.info('Find one fileUpload id: ' + id);
    const model = await this.fileUploadRepository.findById(id);
    return !isEmpty(model) ? this.autoMapper.Map(model, FileUpload, FileUploadDto) : {};
  }

  async createMulti(
    fileUpload: FileUploadDto[],
  ): Promise<FileUploadDto[]> {
    this.log.info('Create new FileUpload');
    const fileUploadModel = this.autoMapper.MapArray(fileUpload, FileUploadDto, FileUpload);
    const newFileUpload = await this.fileUploadRepository.insertMany(
        fileUploadModel,
    );
    this.eventDispatcher.dispatch(events.fileUpload.created, newFileUpload);
    return !isEmpty(newFileUpload)
      ? this.autoMapper.MapArray(newFileUpload, FileUpload, FileUploadDto) : [];
  }

  async update(_id: string, fileUpload: FileUpload): Promise<boolean> {
    this.log.info('Update fileUpload id: ' + _id);
    const result = await this.fileUploadRepository.update({ _id }, fileUpload);
    if (result) {
      this.eventDispatcher.dispatch(events.fileUpload.updated, fileUpload);
    }

    return result;
  }

  async delete(_id: string): Promise<boolean> {
    this.log.info('Delete a FileUpload');
    const result = await this.fileUploadRepository.deleteById(_id);
    if (result) {
      this.eventDispatcher.dispatch(events.fileUpload.deleted, _id);
    }
    return result;
  }
}
