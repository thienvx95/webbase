import { banner } from '@core/ultis';
import { ILoader, ISettings } from '@microframework';
import { Express } from 'express';
import { ISystemConfig } from "@core/configuration";

export const ExpressLoader: ILoader = async (
  settings: ISettings | undefined,
) => {
  if (settings) {
    const expressApp = settings.getData<Express>('express_app');
    const configs = settings.getData<ISystemConfig>('configs');
    const hostName = configs.AppInfo.Host;
    const port = configs.AppInfo.Port;
    expressApp
    .listen(port, hostName, () => {
      banner()
    });
  }
};
