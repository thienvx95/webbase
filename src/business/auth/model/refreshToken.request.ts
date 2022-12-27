
import { IsNotEmpty } from "class-validator";

export class RefreshTokenRequest {
  @IsNotEmpty({
    message: "Require token",
  })
  token: string;
}