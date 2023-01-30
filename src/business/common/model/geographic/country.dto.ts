import { IsString } from "class-validator";

export class CountryDto {
    @IsString()
    name:string;
    @IsString()
    code:string;
}