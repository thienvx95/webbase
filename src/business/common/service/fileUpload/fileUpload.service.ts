import { events } from '@business/core/events';
import { FileUpload } from '@entities/index';
import { Logging } from '@core/log';
import { FileUploadDto } from '@business/common/model';
import { inject, injectable } from 'inversify';
import { IAutoMapper, IEventDispatcher, IFileUploadService, IRepository } from '@business/core/interface';
import { COMMON_TYPES, REPOSITORY_TYPES } from '@infrastructures/modules';

@injectable()
export class FileUploadService implements IFileUploadService {
  private log = Logging.getInstance('FileUploadService');
  constructor(
    @inject(REPOSITORY_TYPES.FileUploadRepository)
    private fileUploadRepository: IRepository<FileUpload>,
    @inject(COMMON_TYPES.EventDispatcher)
    private eventDispatcher: IEventDispatcher,
    @inject(COMMON_TYPES.AutoMapper) private autoMapper: IAutoMapper,
  ) {}

  async findByKey(key: string): Promise<FileUploadDto> {
    const model = await this.fileUploadRepository.findOne({ path: key });
    return this.autoMapper.Map(model, FileUpload, FileUploadDto);
  }

  async find(): Promise<FileUploadDto[]> {
    this.log.info('Find all FileUploads');
    const models = await this.fileUploadRepository.find({});
    return this.autoMapper.MapArray(models, FileUpload, FileUploadDto);
  }

  async findById(id: string): Promise<FileUploadDto> {
    this.log.info('Find one fileUpload id: ' + id);
    const model = await this.fileUploadRepository.findById(id);
    return this.autoMapper.Map(model, FileUpload, FileUploadDto)
  }

  async createMulti(fileUpload: FileUploadDto[]): Promise<FileUploadDto[]> {
    this.log.info('Create new FileUpload');
    const fileUploadModel = this.autoMapper.MapArray(
      fileUpload,
      FileUploadDto,
      FileUpload,
    );
    const newFileUpload = await this.fileUploadRepository.insertMany(
      fileUploadModel,
    );
    this.eventDispatcher.dispatch(events.fileUpload.created, newFileUpload);
    return this.autoMapper.MapArray(newFileUpload, FileUpload, FileUploadDto);
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
