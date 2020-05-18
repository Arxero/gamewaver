import { IsString, Length, IsJWT } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class ResetPasswordCmd {
  constructor(data: { password: string; token: string }) {
    if (data) {
      this.password = data.password;
      this.token = data.token;
    }
  }

  @ApiProperty({ minLength: 6, maxLength: 30 })
  @IsString()
  @Length(6, 30)
  password: string;

  @ApiProperty()
  @IsJWT()
  token: string;
}
