import { IUser, UserRole, UserStatus } from "src/users/models/user.entity";

export class GetProfileDto implements IUser {
  constructor(data: IUser) {
    this.id = data.id;
    this.username = data.username;
    this.email = data.email;
    this.role = data.role;
    this.status = data.status;
  }

  id: string;
  username: string;
  email: string;
  role: UserRole;
  status: UserStatus;
}