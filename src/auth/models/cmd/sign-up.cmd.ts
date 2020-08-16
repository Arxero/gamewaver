import { IUser } from 'src/users/models/user.entity';
import { Length, IsString, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BaseCmd } from 'src/common/models/base-cmd';

export class SignUpCmd extends BaseCmd {
  @ApiProperty({ minLength: 3, maxLength: 20 })
  @IsString()
  @Length(3, 30)
  username: string;

  @ApiProperty({ minLength: 6, maxLength: 30 })
  @IsString()
  @Length(6, 30)
  password: string;

  @ApiProperty({ minLength: 6, maxLength: 30 })
  @IsString()
  @IsEmail()
  @Length(6, 30)
  email: string;

  @ApiProperty()
  @IsString()
  reCaptchaaToken: string;
}
