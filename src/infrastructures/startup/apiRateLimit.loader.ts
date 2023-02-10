import { ISystemConfig } from '@core/configuration';
import { ILoader, ISettings } from '@microframework';
import { Express } from 'express';
import * as rateLimit from 'express-rate-limit';

export const ApiRateLimitLoader: ILoader = async (
  settings: ISettings | undefined,
) => {
  if (settings) {
    const expressApp = settings.getData<Express>('express_app');
    const configs = settings.getData<ISystemConfig>('configs');
    const limiter = rateLimit.default({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
      standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
      legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    });

    expressApp.use(`/${configs.AppSetting.APIPrefix}`, limiter);
  }
};
