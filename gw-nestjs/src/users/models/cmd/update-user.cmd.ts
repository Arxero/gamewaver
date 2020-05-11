import { IUser, UserRole, UserStatus } from '../user.entity';

export class UpdateUserCmd {
  constructor(data: IUser) {
    this.id = data.id;
    this.email = data.email;
    this.username = data.username;
    this.password = data.password;
    this.role = data.role;
    this.status = data.status;
  }

  id: string;
  username?: string;
  email?: string;
  password?: string;
  role?: UserRole;
  status?: UserStatus;
}
