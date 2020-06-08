import { IUser, UserRole, UserStatus } from '../user.entity';
import { IsString, Length, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserCmd {
  @ApiProperty({ minLength: 3, maxLength: 20 })
  @IsString()
  @Length(3, 30)
  username?: string;

  @ApiProperty({ minLength: 6, maxLength: 30 })
  @IsString()
  @IsEmail()
  @Length(6, 30)
  email?: string;

  @ApiProperty({ minLength: 6, maxLength: 30 })
  @IsString()
  @Length(6, 30)
  password?: string;

  @ApiProperty({ minLength: 3, maxLength: 30 })
  @IsString()
  @Length(3, 30)
  role?: UserRole;

  @ApiProperty({ minLength: 3, maxLength: 30 })
  @IsString()
  @Length(3, 30)
  status?: UserStatus;
}
