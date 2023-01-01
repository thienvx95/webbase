import { ILoader, ISettings } from '@microframework';
import { Express } from 'express';
import * as basicAuth from 'express-basic-auth';

import { BaseAdapter } from '@bull-board/api/dist/src/queueAdapters/base'
import { createBullBoard } from '@bull-board/api';
import { ExpressAdapter } from '@bull-board/express';
import { ISystemConfig } from '@core/configuration/systemConfig.interface';

export const QueueMonitorLoader: ILoader = async (
  settings: ISettings | undefined,
) => {
  if (settings) {
    const expressApp = settings.getData<Express>('express_app');
    const configs = settings.getData<ISystemConfig>('configs');
    if (!configs.QueueMonitorSetting.Enable) return;

    const serverAdapter = new ExpressAdapter();
    const queues: ReadonlyArray<BaseAdapter> = [];
    createBullBoard({
      queues: queues,
      serverAdapter,
    });

    serverAdapter.setBasePath(configs.QueueMonitorSetting.Route);

    expressApp.use(
        configs.QueueMonitorSetting.Route,
        configs.QueueMonitorSetting.User
        ? basicAuth({
            users: {
              [`${configs.QueueMonitorSetting.User}`]:
              configs.QueueMonitorSetting.Password,
            },
            challenge: true,
          })
        : (_req: any, _res: any, next: any): void => next(),
      serverAdapter.getRouter(),
    );
  }
};
