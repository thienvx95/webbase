import { IsString, IsBoolean, IsArray, IsObject } from "class-validator";
import { AutoMap } from "@automapper/classes";
import { ISettingSelectOption, SettingValue } from "@entities/settings/setting.entity";


export class SettingDto {
    @AutoMap()
    @IsString()
	id: string;

    @AutoMap()
    @IsString()
	type: string | "boolean" | "string" | "int" | "select" | "multiSelect" | "font" | "date";

    @AutoMap()
    @IsBoolean()
	public: boolean;

    @AutoMap()
    @IsString()
	group?: string;

    @AutoMap()
    @IsString()
	section?: string;

    @AutoMap()
    @IsString()
	name: string;

    @AutoMap()
    @IsObject()
	value: SettingValue;

    @AutoMap()
    @IsString()
	description?: string;

    @AutoMap()
    @IsArray()
	values?: Array<ISettingSelectOption>;
}