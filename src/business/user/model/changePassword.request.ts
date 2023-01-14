import { IsString, IsNotEmpty, MinLength, MaxLength, Matches } from "class-validator";
import { Match } from "@core/decorators/match.decorator";
import { PasswordRegex } from "@core/constants";
export class ChangePasswordRequest {
  @IsNotEmpty()
  @IsString()
  currentPassword: string;

  @Matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/, {
    message:
      "InvalidPasswordFormat",
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @Matches(PasswordRegex, {message: "Password too weak"})
  newPassword: string;


  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @Match("newPassword")
  confirmPassword: string;
}
