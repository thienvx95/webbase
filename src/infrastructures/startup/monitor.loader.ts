import { ISystemConfig } from '@core/configuration/systemConfig.interface';
import { ILoader, ISettings } from '@microframework';
import { Express } from "express";
import * as basicAuth from "express-basic-auth";
import * as monitor from "express-status-monitor";

export const MonitorLoader: ILoader = async (
  settings: ISettings | undefined,
) => {
  if (settings) {
    const expressApp = settings.getData<Express>('express_app');
    const configs = settings.getData<ISystemConfig>('configs');
    if(!configs.StatusMonitorSetting.Enable) return;
    const monitorOptions: monitor.ExpressStatusMonitorConfig = {
      title: configs.AppInfo.Name,
      spans: [
        {
          interval: 1, // Every second
          retention: 60, // Keep 60 data-points in memory
        },
        {
          interval: 5,
          retention: 60,
        },
        {
          interval: 15,
          retention: 60,
        },
      ],
      chartVisibility: {
        mem: true,
        rps: true,
        cpu: true,
        load: true,
        statusCodes: true,
        responseTime: true,
      },
      healthChecks: [
        {
          protocol: configs.AppInfo.Schema,
          host: configs.AppInfo.Host,
          path: `/${configs.AppSetting.APIPrefix}`,
          port: configs.AppInfo.Port,
        },
      ],
    };
    
    // Loads the express status monitor middleware.
    const statusMonitor: any = monitor(monitorOptions);
    expressApp.use(statusMonitor.middleware);
    expressApp.get(
      configs.StatusMonitorSetting.Route,
      configs.StatusMonitorSetting.User
        ? basicAuth({
            users: {
              [`${configs.StatusMonitorSetting.User}`]:
              configs.StatusMonitorSetting.Password,
            },
            challenge: true,
          })
        : (_req: any, _res: any, next: any) => next(),
        statusMonitor.pageRoute
    );
  }
};
