import { Setting, SettingValue } from "@entities/settings/setting.entity";
import { getModelForClass, ReturnModelType } from "@typegoose/typegoose";
import { BeAnObject } from "@typegoose/typegoose/lib/types";
import { isEmpty } from "lodash";

export interface ISiteSettings{
    get(_id: string, isReload?: boolean): SettingValue
  }

export class SiteSettings implements ISiteSettings {
    private _cache = new Map<string, SettingValue>();
    private _settingModel: ReturnModelType<typeof Setting, BeAnObject>
    private static _instance: SiteSettings;
    constructor(){
        this._settingModel = getModelForClass(Setting);
        this.init();
    }

    public static getInstance(): SiteSettings {
        if (!SiteSettings._instance) {
            SiteSettings._instance = new SiteSettings();
        }
    
        return SiteSettings._instance;
      }

    init(): void {
		this._settingModel.find({ type: { $nin: ["section", "group"] } },(_err, data) => {
			if(!isEmpty(data)){
				data.forEach((record: Setting) => {
					this.setValue(record._id, record.value);
				});
			}
		});
	}

	get(_id: string, isReload = false): SettingValue {
		return this.getValue(_id, isReload);
	}

    private setValue = (_id: string, value: SettingValue): void => {
        this._cache.set(_id, value);
    };
    
    private setFromDB = (_id: string): void => {
        this._settingModel.findById(_id, { fields: { value: 1 } }, {}, (err: any, data: any) => {
            if(err) return;
            if(data){
                this.setValue(_id, data.value);
            }
        });
    };
    
    private getValue = (_id: string, isReload = false): SettingValue  => {
        if (!this._cache.has(_id) || isReload) {
            this.setFromDB(_id);
            return this._cache.get(_id);
        }
    
        return this._cache.get(_id);
    };
}
