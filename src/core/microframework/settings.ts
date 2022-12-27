import { ShutdownHandler } from './shutdownHandler';

export interface ISettings{
    setData<T>(key: string, value: T): this
    getData<T>(key: string): T
    onShutdown(handler: ShutdownHandler): this
    getShutdownHandlers(): ShutdownHandler[]
}

export class Settings implements ISettings {
  private data: { [key: string]: any } = {};
  private shutdownHandlers: ShutdownHandler[] = [];

  setData<T>(key: string, value: T): this {
    this.data[key] = value;
    return this;
  }

  getData<T>(key: string): T {
    return this.data[key] as T;
  }

  onShutdown(handler: ShutdownHandler): this {
    this.shutdownHandlers.push(handler);
    return this;
  }

  getShutdownHandlers(): ShutdownHandler[] {
    return this.shutdownHandlers.map(handlers => handlers);
  }
}