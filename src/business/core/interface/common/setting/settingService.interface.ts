import { Session } from "@business/auth/model";
import { SettingDto } from "@business/common/model";

export interface ISettingService {
    findGroup(): Promise<SettingDto[]>;
    findByGroup(id: string): Promise<SettingDto[]>;
    update(settings: SettingDto[], session: Session): Promise<boolean>;
  }