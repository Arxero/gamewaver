import { IsString, Length, IsEmail } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export interface IChangePasswordCmd {
  email: string;
  oldPassword: string;
  newPassword: string;
}

export class ChangePasswordCmd {
  constructor(data: IChangePasswordCmd) {
    if (data) {
      this.email = data.email;
      this.oldPassword = data.oldPassword;
      this.newPassword = data.newPassword;
    }

  }

  @ApiProperty({ minLength: 6, maxLength: 30 })
  @IsString()
  @IsEmail()
  @Length(6, 30)
  email: string;

  @ApiProperty({ minLength: 6, maxLength: 30 })
  @IsString()
  @Length(6, 30)
  oldPassword: string;

  @ApiProperty({ minLength: 6, maxLength: 30 })
  @IsString()
  @Length(6, 30)
  newPassword: string;
}