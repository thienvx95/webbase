import { SystemConfig } from "@core/configuration";
import { ApplicationVersion } from "@core/constants";
import { ApplicationInfo } from "@entities/application/applicationInfo.entity";
import { getModelForClass, ReturnModelType } from "@typegoose/typegoose";
import { BeAnObject } from "@typegoose/typegoose/lib/types";
import { CallbackError, Types } from "mongoose";

export interface IApplication {
    get(): ApplicationInfo
  }

export class Application implements IApplication {
    private _cache = new Map<string, ApplicationInfo>();
    private _applicationModel: ReturnModelType<typeof ApplicationInfo, BeAnObject>
    private static _instance: Application;
    constructor(){
        this._applicationModel = getModelForClass(ApplicationInfo);
        this.init();
    }

    public static getInstance(): Application {
        if (!Application._instance) {
            Application._instance = new Application();
        }
        
        return Application._instance;
      }

    init(): void {
		this._applicationModel.findOne({}, {}, (err: CallbackError, data: any) => {
            if(err) return;
            if(data){
                this._cache.set('applicationInfo', data.value);
                return;
            }

            this._applicationModel.create({ 
                _id: new Types.ObjectId(),
                isInstall: false, 
                nodeVersion: process.version, 
                dbVersion: SystemConfig.DbVersion,
                dbProvider: SystemConfig.DbProvider,
                version: ApplicationVersion,
                databaseMigration: '',
            }, (err: CallbackError, data: any) => { 
                if(err) return;
                this._cache.set('applicationInfo', data.value);
              });
        });
	}

	get(isReload = false): ApplicationInfo {
		return this.getValue('applicationInfo', isReload);
	}

    private setValue = (_id: string, value: ApplicationInfo): void => {
        this._cache.set(_id, value);
    };
    
    private setFromDB = (_id: string): void => {
        this._applicationModel.findOne({}, {}, (err: CallbackError, data: any) => {
            if(err) return;
            if(data){
                this.setValue(_id, data.value);
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
