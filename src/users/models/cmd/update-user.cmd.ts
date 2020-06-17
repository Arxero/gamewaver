import { IUser, UserRole, UserStatus, UserGender } from '../user.entity';
import { IsString, Length, IsEmail, IsUrl, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserCmd {
  @ApiProperty({ minLength: 6, maxLength: 30 })
  @IsString()
  @IsEmail()
  @Length(6, 30)
  email: string;

  @ApiProperty()
  @IsString()
  @IsUrl()
  avatar: string;

  @ApiProperty()
  @IsString()
  summary: string;

  @ApiProperty()
  @IsString()
  location: string;

  @ApiProperty()
  @IsOptional()
  @IsEnum(UserGender)
  gender: UserGender;
}
