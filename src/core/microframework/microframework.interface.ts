import { Settings } from './settings';

export interface ILoader {
  (options?: Settings): Promise<any> | any;
}

export interface IBootstrapConfig {
  config?: IConfig | string | string[];
  loaders?: ILoader[];
}

export interface IConfig {
  showBootstrapTime?: boolean;
  showLoaderInit?: boolean;
  debug?: boolean;
  bootstrapTimeout?: number;
}
