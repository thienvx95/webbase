import { ILoader, ISettings } from '@microframework';
import {
  createExpressServer,
  RoutingControllersOptions,
} from 'routing-controllers';
import { AuthorizationChecker } from '../auth/authorization.checker';
import { CurrentUserChecker } from '../auth/currentUser.checker';
import { ISystemConfig } from '@core/configuration/systemConfig.interface';
export const RoutingControllerLoader: ILoader = async (
  settings: ISettings | undefined,
) => {
  if (settings) {
    const configs = settings.getData<ISystemConfig>('configs');
    
    const options: RoutingControllersOptions = {
      authorizationChecker: AuthorizationChecker,
      currentUserChecker: CurrentUserChecker,
      classTransformer: true,
      routePrefix: `/${configs.AppSetting.APIPrefix}`,
      cors: configs.AppSetting.isCORSEnabled,
      defaultErrorHandler: false,
      validation: true,
      development: !configs.IsProduction,
    };
    const expressApp = createExpressServer(options);
    
    settings.setData('express_app', expressApp);
  }
};
