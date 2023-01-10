import { SystemConfig } from '@core/configuration';
import { Logging } from '@core/log';
import { Application } from "@infrastructures/applicationInfo";

export const banner = (): void =>  {
    const log = Logging.getInstance('Startup');
    const configs = SystemConfig.Configs;
    const application = Application.getInstance().get();
    const route = `${configs.AppInfo.Schema}://${configs.AppInfo.Host}:${configs.AppInfo.Port}`;
    log.info('-------------------------------------------------------');
    log.info(`Environment       : ${configs.Node}`);
    log.info(`App version       : ${application.version}`);
    log.info(`Node version      : ${process.version}`);
    log.info(`Database Provider : ${SystemConfig.DbProvider}`);
    log.info(`Database Version  : ${SystemConfig.DbVersion}`);
    log.info(`Migration Version : ${application.databaseMigration}`);
    log.info(`Storage Provider  : ${configs.StorageProvider}`);
    log.info(`Cache Provider    : ${configs.CacheProvider}`);
    log.info(`Log Level         : ${configs.LoggingSetting.Level}`);
    log.info(`Server Info       : ${route}`);
    log.info(`API Info          : ${route}/${configs.AppSetting.APIPrefix}`);
    if (configs.SwaggerSetting.Enable) {
        log.info(`Swagger           : ${route}${configs.SwaggerSetting.Route}`);
    }
    if (configs.StatusMonitorSetting.Enable) {
        log.info(`Monitor           : ${route}${configs.StatusMonitorSetting.Route}`);
    }
    if (configs.QueueMonitorSetting.Enable) {
        log.info(`Queue             : ${route}${configs.QueueMonitorSetting.Route}`);
    }
    log.info('-------------------------------------------------------');
}