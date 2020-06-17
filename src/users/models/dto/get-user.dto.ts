import { IUser, UserRole, UserStatus, UserGender } from '../user.entity';

export class GetUserDto implements IUser {
  constructor(data: IUser) {
    this.id = data.id;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;

    this.username = data.username;
    this.email = data.email;
    this.role = data.role;
    this.status = data.status;

    this.avatar = data.avatar;
    this.summary = data.summary;
    this.location = data.location;
    this.gender = data.gender;
  }

  id: string;
  createdAt: Date;
  updatedAt: Date;

  username: string;
  email: string;
  role: UserRole;
  status: UserStatus;

  avatar: string;
  summary: string;
  location: string;
  gender: UserGender;
}