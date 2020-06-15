import { IUser, UserRole, UserStatus, UserGender } from "src/users/models/user.entity";

export class GetProfileDto implements IUser {
  constructor(data: IUser) {
    this.id = data.id;
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
  username: string;
  email: string;
  role: UserRole;
  status: UserStatus;

  avatar: string;
  summary: string;
  location: string;
  gender: UserGender;
}