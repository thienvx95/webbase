

import { IsNotEmpty } from "class-validator";

export class AuthResponse {
  @IsNotEmpty()
  token: string;

  @IsNotEmpty()
  refreshToken: string;
}