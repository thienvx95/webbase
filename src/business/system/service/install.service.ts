import { Service } from 'typedi';

import {
  IRepository,
  Repository
} from '@infrastructures/decorators';
import { ApplicationInfo } from '@entities/application/applicationInfo.entity';
import { ApplicationVersion } from '@core/constants';

export interface IInstallService {
  install(): Promise<boolean>;
  IsInstall(): Promise<boolean>;
}
@Service()
export class InstallService implements IInstallService {
  constructor(
    @Repository<ApplicationInfo>() private applicationInfoRepositor: IRepository<ApplicationInfo>) {
  }

  async install(): Promise<boolean> {
    return true;
  }

  async IsInstall(): Promise<boolean> {
    const applicationInfo = await this.applicationInfoRepositor.findOrInsertOne({}, new ApplicationInfo("", false));
    return applicationInfo?.isInstall;
  }
}
