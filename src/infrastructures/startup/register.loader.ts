import { ILoader, ISettings } from '@microframework';
import * as glob from 'glob';
import { getPath } from '@core/ultis';
import { SystemConfig } from '@core/configuration';

export const RegisterLoader: ILoader = async (
  settings: ISettings | undefined,
) => {
  if (settings) {
    const dirsConfig = SystemConfig.Configs.Dirs;
    const lstRegister = [
      getPath(dirsConfig.Subscribers),
      getPath(dirsConfig.Controllers),
      getPath(dirsConfig.Middlewares),
      getPath(dirsConfig.Interceptors),
    ];
    lstRegister.forEach(async (x) => {
      const subFiles = await glob.sync(x, { windowsPathsNoEscape: true });

      if (subFiles && subFiles.length > 0) {
        subFiles.forEach((file) => require(file));
      }
    });
  }
};
