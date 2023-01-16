import { EventDispatcher as EventDispatcherExtend } from "event-dispatch";
import { injectable, decorate } from "inversify";
@injectable()
export class EventDispatcher extends EventDispatcherExtend {
    constructor(){
        super();
    }
}

decorate(injectable(), EventDispatcherExtend);
