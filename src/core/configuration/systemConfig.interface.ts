import { DbProvider } from "@core/enums/dbProvider.enum";
import { StorageProvider } from "@core/enums/storageProvider.enum";

export interface AppInfo {
  Name?: string;
  Version?: string;
  Description?: string;
  Schema?: string;
  Port?: number;
  Host?: string;
}

export interface S3Config {
  BucketName?: string;
  DefaultRegion?: string;
  DefaultFilesACL?: string;
}

export interface AppSetting {
  SecretKey?: string;
  APIPrefix?: string;
  MaxUploadLimit?: string;
  MaxParameterLimit?: number;
  isCORSEnabled?: boolean;
  jwtExpiresIn?: number;
  refreshTokenExpriesIn?: number;
}

export interface LoggingSetting {
  Type?: string;
  SentryDSN?: string;
  Day?: number;
  Level?: string;
  Output?: string;
  FileName?: string;
  DatePattern?: string;
  MaxSize?: string;
  Folder?: string;
}

export interface DataSettings {
  ConnectionString ?: string;
  DbProvider: DbProvider;
  DbName?: string;
}

export interface SwaggerSetting {
  Enable?: boolean;
  Route?: string;
  User?: string;
  Password?: string;
}

export interface StatusMonitorSetting {
  Enable?: boolean;
  Route?: string;
  User?: string;
  Password?: string;
}

export interface QueueMonitorSetting {
  Enable?: boolean;
  Route?: string;
  User?: string;
  Password?: string;
}

export interface ReditSetting {
  Url?: string;
  Port?: number;
  Host?: string;
  Db?: number;
  Password?: string;
  Prefix?: string;
}
export interface ISystemConfig {
  Node?:string;
  IsProduction:boolean;
  AppInfo?: AppInfo;
  AppSetting?: AppSetting;
  DatabaseVersion: string;
  LoggingSetting?: LoggingSetting;
  DataSettings?: DataSettings;
  SwaggerSetting?: SwaggerSetting;
  StatusMonitorSetting?: StatusMonitorSetting;
  QueueMonitorSetting?: QueueMonitorSetting;
  ReditSetting?: ReditSetting;
  StorageProvider?: StorageProvider;
  S3Config?: S3Config;
  Dirs: PathStructure;
  InstallKey: string;
}

export interface PathStructure{
  Controllers: string;
  Middlewares: string;
  Interceptors: string;
  Subscribers: string;
}