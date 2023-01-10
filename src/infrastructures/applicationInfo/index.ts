import { SystemConfig } from "@core/configuration";
import { ApplicationVersion } from "@core/constants";
import { ApplicationInfo } from "@entities/application/applicationInfo.entity";
import { MigrationDb } from "@entities/data/migrationDb.entity";
import { getModelForClass, ReturnModelType } from "@typegoose/typegoose";
import { BeAnObject } from "@typegoose/typegoose/lib/types";
import { CallbackError, Types } from "mongoose";

export interface IApplication {
    get(): ApplicationInfo
  }

export class Application implements IApplication {
    private _cache = new Map<string, ApplicationInfo>();
    private _applicationModel: ReturnModelType<typeof ApplicationInfo, BeAnObject>
    private _migrationModel: ReturnModelType<typeof MigrationDb, BeAnObject>
    private static _instance: Application;
    constructor(){
        this._applicationModel = getModelForClass(ApplicationInfo);
        this._migrationModel = getModelForClass(MigrationDb);
    }

    public static get isInstall(): boolean {
        const data = this.getInstance().get();
        return data.isInstall;
    }

    public static getInstance(): Application {
        if (!Application._instance) {
            Application._instance = new Application();
        }
        
        return Application._instance;
      }

    async init(): Promise<void> {
        const migrationDbId = await this.getLastestDbMigrationVersion();
        const application = await this._applicationModel.findOne({}).exec();
        if(application){
            await this._applicationModel.updateOne({ version: ApplicationVersion },  { 
                nodeVersion: process.version, 
                dbVersion: SystemConfig.DbVersion,
                dbProvider: SystemConfig.DbProvider,
                version: ApplicationVersion,
                databaseMigration: migrationDbId,
            }, {}).exec();
            this._cache.set('applicationInfo', application);
            return;
        } else {
            const newModel = await this._applicationModel.create({ 
                _id: new Types.ObjectId(),
                isInstall: false, 
                nodeVersion: process.version, 
                dbVersion: SystemConfig.DbVersion,
                dbProvider: SystemConfig.DbProvider,
                version: ApplicationVersion,
                databaseMigration: migrationDbId,
            });
            this._cache.set('applicationInfo', newModel);
            return;
        }
	}

	get(isReload = false): ApplicationInfo {
		return this.getValue('applicationInfo', isReload);
	}

    setIsInstall(value: boolean): void {
        this._applicationModel.updateOne({ version: ApplicationVersion },  { isInstall: value }, {}, () => null);
        this.get(true);
    }

    private getLastestDbMigrationVersion = async (): Promise<string> => {
        const lastestVersion = await this._migrationModel.findOne().sort({ appliedAt: -1 }).exec();
        return lastestVersion?._id?.toString();
    }
    private setValue = (_id: string, value: ApplicationInfo): void => {
        this._cache.set(_id, value);
    };
    
    private setFromDB = (_id: string): void => {
        this._applicationModel.findOne({}, {}, (err: CallbackError, data: any) => {
            if(err) return;
            if(data){
                this.setValue(_id, data);
            }
        });
    };
    
    private getValue = (_id: string, isReload = false): ApplicationInfo  => {
        if (!this._cache.has(_id) || isReload) {
            this.setFromDB(_id);
            return this._cache.get(_id);
        }
    
        return this._cache.get(_id);
    };
}
