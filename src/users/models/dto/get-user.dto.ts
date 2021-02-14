import { BaseDto } from './../../../common/models/base.dto';
import { IUser, UserRole, UserStatus, UserGender } from '../user.entity';

export class GetUserDto extends BaseDto {
  constructor(data: IUser) {
    super(data);
    this.username = data.username;
    this.email = data.email;
    this.role = data.role;
    this.status = data.status;
    this.avatar = data.avatar;
    this.summary = data.summary;
    this.location = data.location;
    this.gender = data.gender;
  }

  username: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  avatar: string;
  summary: string;
  location: string;
  gender: UserGender;
}