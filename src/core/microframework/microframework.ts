import { path } from 'app-root-path';
import { ISettings, Settings } from './settings';
import { IConfig, ILoader } from './microframework.interface';
import { NotBootstrappedError } from './error/notBootstrappedError';
import { Logging } from '@core/log';

export interface IMicroframework{
    config(config: IConfig | string | string[]): this
    registerLoader(loader: ILoader): this
    registerLoaders(loaders: ILoader[]): this
    bootstrap(): Promise<this>
    shutdown(): Promise<this>
}

export class Microframework implements IMicroframework {
  private _logging = Logging.getInstance('Microframwork');
  private frameworkConfig?: IConfig;
  private allConfiguration: any = {};
  private loaders: ILoader[] = [];
  private frameworkSettings?: Settings;

  config(config: IConfig | string | string[]): this {
    const appRootDir = path;
    if (typeof config == 'string') {
      this.allConfiguration = require(appRootDir + '/' + config + '.json') || {};
      if (this.allConfiguration.microframework) this.frameworkConfig = this.allConfiguration.microframework;
    } else if (Array.isArray(config)) {
      // string[]
      if (config.length > 0) {
        this.allConfiguration = {};
        Object.assign(this.allConfiguration, ...config.map(conf => require(appRootDir + '/' + conf + '.json') || {}));
      }
    } else {
      this.frameworkConfig = config;
    }

    return this;
  }

  registerLoader(loader: ILoader): this {
    this.loaders.push(loader);
    return this;
  }

  registerLoaders(loaders: ILoader[]): this {
    ((loaders as ILoader[]) || []).forEach(loader => {
      if (loader instanceof Array) {
        this.loaders.push(...loader);
      } else {
        this.loaders.push(loader);
      }
    });
    return this;
  }
  
  bootstrap(): Promise<this> {
    this.frameworkSettings = new Settings();
    const bootstrapTime = +new Date();
    return this.runInSequence<ILoader,ISettings>(this.loaders, loader => {
      const loaderResult = loader(this.frameworkSettings);
      return loaderResult instanceof Promise ? loaderResult : Promise.resolve();
    })
    .then(() => {
        if (this.frameworkConfig && this.frameworkConfig.showBootstrapTime)
        this._logging.info(`Application is up and running. It took ${
          +new Date() - bootstrapTime - (this.frameworkConfig.bootstrapTimeout || 0)
        } ms to bootstrap the app.`)

        return this;
      });
  }

  shutdown(): Promise<this> {
    if (!this.frameworkSettings) throw new NotBootstrappedError();

    return this.runInSequence(this.frameworkSettings.getShutdownHandlers(), handler => {
      const handlerResult = handler();
      return handlerResult instanceof Promise ? handlerResult : Promise.resolve();
    }).then(() => this);
  }

  get settings(): ISettings {
    if (!this.frameworkSettings) throw new NotBootstrappedError();

    return this.frameworkSettings;
  }

  private runInSequence<T, U>(collection: T[], callback: (item: T) => Promise<U>): Promise<U[]> {
    const results: U[] = [];
    return collection
      .reduce((promise, item) => {
        return promise
          .then(() => {
            return callback(item);
          })
          .then(result => {
            results.push(result);
          });
      }, Promise.resolve())
      .then(() => {
        return results;
      });
  }
}