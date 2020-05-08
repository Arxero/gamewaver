import { IUser, UserRole, UserStatus } from "src/users/models/user.entity";

export class TokenUserPayloadDto {
  constructor(data: IUser) {
    this.sub = data.id;
    this.username = data.username;
    this.email = data.email;
    this.role = data.role;
    this.status = data.status;
  }
  
  sub: string;
  username: string;
  email: string;
  role: UserRole;
  status: UserStatus;
}