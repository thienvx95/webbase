
import { IsNotEmpty } from "class-validator";

export class AuthRequest {
  @IsNotEmpty({
    message: "Required username!",
  })
  username: string;

  @IsNotEmpty({
    message: "Required password!",
  })
  password: string;
}