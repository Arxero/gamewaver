import { IUser } from 'src/users/models/user.entity';

export class SignUpCmd implements IUser {
  constructor(data: IUser) {
    this.username = data.username;
    this.password = data.password;
    this.email = data.email;
  }

  username: string;
  password: string;
  email: string;
}
