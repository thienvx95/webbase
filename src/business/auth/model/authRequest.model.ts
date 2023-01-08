
import { IsNotEmpty, IsString } from "class-validator";

export class AuthRequest {
  @IsNotEmpty({
    message: "Required username!",
  })
  @IsString()
  username: string;

  @IsNotEmpty({
    message: "Required password!",
  })
  @IsString()
  password: string;

  autoLogin:boolean;
}