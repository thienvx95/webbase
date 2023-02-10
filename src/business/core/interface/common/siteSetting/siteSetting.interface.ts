export interface ISiteSettings {
  get<T>(_id: string, isReload?: boolean): T;
}
