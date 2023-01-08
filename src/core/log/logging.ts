import { path } from 'app-root-path';
import { LoggingSetting, SystemConfig } from '@core/configuration';
import Sentry from 'winston-sentry-log';
import { createLogger, Logger, addColors, format, transports } from 'winston';
import 'winston-daily-rotate-file';
import { LogColors, LogLevels } from '@core/constants';

export interface ILogging {
  info(message: string, method?: string): void;
  warn(message: string, method?: string): void;
  error(message: string, method?: string): void;
}

export class Logging implements ILogging {
    private _className: string;
    private logger: Logger;
    private loggingSettings: LoggingSetting;
    private static instance: Logging;
    
    constructor(className: string) {
      this._className = className;
      this.loggingSettings = SystemConfig.Configs.LoggingSetting;
      this.createLogger();
    }

    private createLogger() : void{
      const listTransports: any[] = [
        new transports.Console({
          format: format.colorize({ all: true }),
        }),
      ];
      if (this.loggingSettings.Type === 'sentry') {
        const sentryOption = {
          config: {
            dsn: this.loggingSettings.SentryDSN,
          },
          level: this.loggingSettings.Level,
        };
        listTransports.push(new Sentry(sentryOption));
      }
      if (this.loggingSettings.Type === 'file') {
        listTransports.push(
          new transports.DailyRotateFile({
            filename: this.loggingSettings.FileName,
            datePattern: this.loggingSettings.DatePattern,
            dirname: `${path}${this.loggingSettings.Folder}`,
            maxSize: this.loggingSettings.MaxSize,
            maxFiles: `${this.loggingSettings.Day}d`,
          }),
        );
      }
  
      addColors(LogColors);

      this.logger = createLogger({
        level: this.loggingSettings.Level,
        levels: LogLevels,
        format: format.combine(
          format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
          format.printf(
            (info) => `${info.timestamp} ${info.level}: ${info.message}`,
          ),
        ),
        transports: listTransports,
      });
    }
  
    // Adds INFO prefix string to the log string
    public info(_string: string, method?: string): void {
      this.logger.info(` ${this._className ? `[${this._className}]` : ''} ${method ? `[${method}] ` : ''} ${_string}`);
    }
  
    // Adds WARN prefix string to the log string
    public warn(_string: string, method?: string): void {
      this.logger.warn(` ${this._className ? `[${this._className}]` : ''} ${method ? `[${method}] ` : ''} ${_string}`);
    }
  
    // Adds ERROR prefix string to the log string
    public error(_string: string, method?: string): void {
      this.logger.error(`${this._className ? `[${this._className}]` : ''} ${method ? `[${method}] ` : ''} ${_string}`);
    }
  
    public static getInstance(className?: string): Logging {
      if (!Logging.instance) {
        Logging.instance = new Logging(className);
      }
      Logging.instance._className = className;
      return Logging.instance;
    }
  }
  
  export default Logging;
