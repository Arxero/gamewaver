import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, Length } from 'class-validator';

export class ForgotPasswordCmd {
  constructor(data: { email: string }) {
    if (data) {
      this.email = data.email;
    }
  }

  @ApiProperty({ minLength: 6, maxLength: 30 })
  @IsString()
  @IsEmail()
  @Length(6, 30)
  email: string;
}
