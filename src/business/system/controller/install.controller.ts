import { IInstallService } from '@business/core/interface';
import { SystemConfig } from '@core/configuration';
import { SERVICE_TYPES } from '@infrastructures/modules';
import { inject, injectable } from 'inversify';
import { Post, JsonController, Param } from 'routing-controllers';

@injectable()
@JsonController('/install')
export class InstallController {
  private _installService: IInstallService;
  constructor(@inject(SERVICE_TYPES.InstallService) installService: IInstallService) {
    this._installService = installService;
  }

  @Post('/:key')
  async install(@Param('key') key: string): Promise<boolean> {
    const installKey = SystemConfig.Configs.InstallKey;
    if (key !== installKey) {
      return false;
    }
    return this._installService.install();
  }
}
