import { Logging } from '@core/log';
import { EventSubscriber, On } from 'event-dispatch';
import { events } from '@infrastructures/events';
import { FileUpload } from '@entities/fileUploads/fileUpload.entity';

@EventSubscriber()
export class FileUploadEventSubscriber {
  private log = Logging.getInstance('FileUploadEventSubscriber');
  @On(events.fileUpload.created)
  public onUserCreate(FileUpload: FileUpload): void {
    this.log.info(`FileUpload ${JSON.stringify(FileUpload)} created!`);
  }
  @On(events.fileUpload.updated)
  public onFileUploadUpdated(FileUpload: FileUpload): void {
    this.log.info(`FileUpload with data ${JSON.stringify(FileUpload)} updated!`);
  }
  @On(events.fileUpload.deleted)
  public onFileUploadDeleted(_id: string): void {
    this.log.info(`FileUpload id: ${_id} deleted!`);
  }
}
