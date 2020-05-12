import { IUser, UserRole, UserStatus } from "./user.entity";

export class UserCreateDto {
  username: string;
  password: string;
  email: string;
}

export class UserUpdateDto {
  email: string;
}

export class GetUserDto {
  constructor(data: IUser) {
    this.id = data.id;
    this.email = data.email;
    this.role = data.role;
    this.status = data.status;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.avatar = data.avatar;
    this.username = data.username;

  }
  
  id: string;
  email: string;
  username: string;
  role: UserRole;
  status: UserStatus;
  createdAt?: Date;
  updatedAt?: Date;
  avatar: string;
}


