
import { IsNumber, IsString } from "class-validator";

export class FileUploadDto {
    @IsString()
    name?: string;
    @IsNumber()
    size?: number;
    @IsString()
    type?: string;
    @IsString()
    extension?: string;
    content?: ArrayBuffer;
    @IsString()
    path?: string;
}