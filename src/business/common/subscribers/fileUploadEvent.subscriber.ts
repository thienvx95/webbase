import { Logging } from '@core/log';
import { EventSubscriber, On } from 'event-dispatch';
import { events } from '@infrastructures/events';
import { FileUpload as FileUploadModel } from '@entities/index';
@EventSubscriber()
export class FileUploadEventSubscriber {
  private log = Logging.getInstance('FileUploadEventSubscriber');
  @On(events.fileUpload.created)
  public onUserCreate(FileUpload: FileUploadModel): void {
    this.log.info(`FileUpload ${JSON.stringify(FileUpload)} created!`);
  }
  @On(events.fileUpload.updated)
  public onFileUploadUpdated(FileUpload: FileUploadModel): void {
    this.log.info(`FileUpload with data ${JSON.stringify(FileUpload)} updated!`);
  }
  @On(events.fileUpload.deleted)
  public onFileUploadDeleted(_id: string): void {
    this.log.info(`FileUpload id: ${_id} deleted!`);
  }
}
