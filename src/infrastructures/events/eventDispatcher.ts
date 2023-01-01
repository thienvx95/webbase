import { EventDispatcher as EventDispatcherExtend } from "event-dispatch";
import { injectable, decorate } from "inversify";
export { EventDispatcher as IEventDispatcher } from "event-dispatch";

@injectable()
export class EventDispatcher extends EventDispatcherExtend {
    constructor(){
        super();
    }
}

decorate(injectable(), EventDispatcherExtend);
