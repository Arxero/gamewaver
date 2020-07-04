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
  @IsOptional()
  @IsUrl()
  avatar: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  summary: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  location: string;

  @ApiProperty()
  @IsOptional()
  @IsEnum(UserGender)
  gender: UserGender;
}
