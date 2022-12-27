import * as dotenv from 'dotenv';
import { path } from 'app-root-path';
import { toNumber, toBool, getOsEnv, normalizePort } from '@core/ultis';
import { ISystemConfig } from './systemConfig.interface';
import { DbProvider } from '@core/enums/dbProvider.enum';
import { StorageProvider } from '@core/enums/storageProvider.enum';
import { MongoRepositotyFactory, S3UploaderFactory } from '@core/factory.constant';

export class SystemConfig {
  private _configs: ISystemConfig;
  public static instance: SystemConfig;
  public DatabaseVersion: string;
  public constructor() {
    this._configs = this.getConfig();
  }

  public static getInstance(): SystemConfig {
    if (!SystemConfig.instance) {
      SystemConfig.instance = new SystemConfig();
    }

    return SystemConfig.instance;
  }

  public static get DbProvider(): DbProvider {
    const configs =  this.getInstance()._configs;
    return configs.DataSettings.DbProvider
  }

  public static get DbVersion(): string {
    return this.getInstance().DatabaseVersion
  }

  public static get Configs():ISystemConfig{
     return this.getInstance()._configs;
  }

  public static SetDatabaseVersion(dbVersion: string): void{
     this.getInstance().setDatabaseVersion(dbVersion);
  }

  public static get getUploaderServiceId(): string{
    if(this.Configs.StorageProvider === StorageProvider.S3){
      return S3UploaderFactory;
    }
    return '';
  }

  public static get getRepositoryServiceId(): string{
    if(this.DbProvider === DbProvider.MongoDB){
      return MongoRepositotyFactory;
    }
    return '';
  }

  private setDatabaseVersion = (dbVersion: string): void => {
    this.DatabaseVersion = dbVersion
  }; 

  private getConfig(): ISystemConfig {
    const pathEnv = `${path}/.env${
      process.env.NODE_ENV === 'production' ? '.production' : '.dev'
    }`;
    dotenv.config({ path: pathEnv });
    return {
      IsProduction: process.env.NODE_ENV === 'production',
      Node: process.env.NODE_ENV || 'development',
      DatabaseVersion: this.DatabaseVersion,
      AppInfo: {
        Host: getOsEnv('APP_HOST'),
        Port: normalizePort(process.env.PORT || getOsEnv('APP_PORT')),
        Name: getOsEnv('APP_NAME'),
        Schema: getOsEnv('APP_SCHEMA'),
      },
      AppSetting: {
        APIPrefix: getOsEnv('APP_API_PREFIX'),
        SecretKey: getOsEnv('APP_SECRET'),
        MaxParameterLimit: toNumber(getOsEnv('APP_MAX_PARAMETER_LIMIT')),
        MaxUploadLimit: getOsEnv('APP_MAX_UPLOAD_LIMIT'),
        isCORSEnabled: toBool(getOsEnv('CORS_ENABLED')),
        jwtExpiresIn: toNumber(getOsEnv('JWT_EXPIRES_IN')),
        refreshTokenExpriesIn: toNumber(getOsEnv('REFRESH_TOKEN_EXPIRES_IN')),
      },
      LoggingSetting: {
        SentryDSN: getOsEnv('LOG_SENTRY_DSN'),
        Type: getOsEnv('LOG_TYPE'),
        Day: toNumber(getOsEnv('LOG_DAYS')),
        Level: getOsEnv('LOG_LEVEL'),
        Output: getOsEnv('LOG_OUTPUT'),
        FileName: getOsEnv('LOG_FILENAME'),
        DatePattern: getOsEnv('LOG_DATEPATTERN'),
        Folder: getOsEnv('LOG_FOLDER'),
        MaxSize: getOsEnv('LOG_MAXSIZE'),
      },
      DataSettings: {
        DbProvider: DbProvider[getOsEnv('DB_PROVIDER')],
        ConnectionString: getOsEnv('CONNECTION_URL'),
        DbName: getOsEnv('DB_NAME')
      },
      QueueMonitorSetting: {
        Enable: toBool(getOsEnv('QUEUE_MONITOR_ENABLED')),
        Password: getOsEnv('QUEUE_MONITOR_USER'),
        Route: getOsEnv('QUEUE_MONITOR_ROUTE'),
        User: getOsEnv('QUEUE_MONITOR_PASSWORD'),
      },
      StatusMonitorSetting: {
        Enable: toBool(getOsEnv('STATUS_MONITOR_ENABLED')),
        Password: getOsEnv('STATUS_MONITOR_USER'),
        Route: getOsEnv('STATUS_MONITOR_ROUTE'),
        User: getOsEnv('STATUS_MONITOR_PASSWORD'),
      },
      SwaggerSetting: {
        Enable: toBool(getOsEnv('SWAGGER_ENABLED')),
        Password: getOsEnv('SWAGGER_USER'),
        Route: getOsEnv('SWAGGER_ROUTE'),
        User: getOsEnv('SWAGGER_PASSWORD'),
      },
      ReditSetting: {
        Db: toNumber(getOsEnv('REDIS_DB')),
        Host: getOsEnv('REDIS_HOST'),
        Password: getOsEnv('REDIS_PASSWORD'),
        Port: toNumber(getOsEnv('REDIS_PORT')),
        Prefix: getOsEnv('REDIS_PREFIX'),
        Url: getOsEnv('REDIS_URL'),
      },
      S3Config: {
        BucketName: getOsEnv('S3_BUCKET_NAME'),
        DefaultFilesACL: getOsEnv('S3_DEFAULT_REGION'),
        DefaultRegion: getOsEnv('S3_DEFAULT_FILES_ACL'),
      },
      Dirs: {
        Controllers: getOsEnv('CONTROLLERS'),
        Interceptors: getOsEnv('INTERCEPTORS'),
        Middlewares: getOsEnv('MIDDLEWARES'),
        Subscribers: getOsEnv('SUBSCRIBERS'),
      },
      StorageProvider: StorageProvider[getOsEnv('STORAGE_PROVIDER')],
    };
  }
}
