import { EventSubscriber, On } from 'event-dispatch';

import { Logging } from '@core/log';
import { User } from '@entities/users/user.entity';
import { events } from '@infrastructures/events';

@EventSubscriber()
export class UserEventSubscriber {
  private _log = Logging.getInstance("UserEventSubscriber");
  @On(events.user.created)
  public onUserCreate(user: User): void {
    this._log.info(`User ${JSON.stringify(user)} created!`);
  }

  @On(events.user.deleted)
  public onUserDeleted(_id: string): void {
    this._log.info(`User id: ${_id} deleted!`);
  }

  @On(events.user.updated)
  public onUserUpdated(user: User): void {
    delete user.password;
    this._log.info(`User with data ${JSON.stringify(user)} updated!`);
  }
}
