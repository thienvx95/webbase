export interface ShutdownHandler {
  (): Promise<unknown> | unknown;
}
