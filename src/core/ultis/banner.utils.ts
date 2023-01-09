import * as chalk from "chalk";
import { SystemConfig } from '@core/configuration';
import { Logging } from '@core/log';

export const banner = (): void =>  {
    const log = Logging.getInstance('Startup');
    const configs = SystemConfig.Configs;
    const route = `${configs.AppInfo.Schema}://${configs.AppInfo.Host}:${configs.AppInfo.Port}`;
    chalk
    log.info('-------------------------------------------------------');
    log.info(`Environment       : ${chalk.red(configs.Node)}`);
    log.info(`Node version      : ${chalk.blue(process.version)}`);
    log.info(`Database Provider : ${chalk.blue(SystemConfig.DbProvider)}`);
    log.info(`Database Version  : ${chalk.blue(SystemConfig.DbVersion)}`);
    log.info(`Storage Provider  : ${chalk.blue(configs.StorageProvider)}`);
    log.info(`Cache Provider    : ${chalk.blue(configs.CacheProvider)}`);
    log.info(`Log Level         : ${chalk.blue(configs.LoggingSetting.Level)}`);
    log.info(`Server Info       : ${chalk.magenta(route)}`);
    log.info(`API Info          : ${chalk.magenta(`${route}/${configs.AppSetting.APIPrefix}`)}`);
    if (configs.SwaggerSetting.Enable) {
        log.info(`Swagger           : ${chalk.magenta(`${route}${configs.SwaggerSetting.Route}`)}`);
    }
    if (configs.StatusMonitorSetting.Enable) {
        log.info(`Monitor           : ${chalk.magenta(`${route}${configs.StatusMonitorSetting.Route}`)}`);
    }
    if (configs.QueueMonitorSetting.Enable) {
        log.info(`Queue             : ${chalk.magenta(`${route}${configs.QueueMonitorSetting.Route}`)}`);
    }
    log.info('-------------------------------------------------------');
}