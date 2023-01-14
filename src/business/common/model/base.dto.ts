import { AutoMap } from "@automapper/classes";
import { IsNotEmpty, IsString } from "class-validator";

export class BaseDto{
    @IsString()
    @AutoMap()
    @IsNotEmpty()
    _id?: string;
}