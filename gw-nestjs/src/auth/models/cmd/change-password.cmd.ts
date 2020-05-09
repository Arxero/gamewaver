export interface IChangePasswordCmd {
  email: string;
  oldPassword: string;
  newPassword: string;
}

export class ChangePasswordCmd {
  constructor(data: IChangePasswordCmd) {
    this.email = data.email;
    this.oldPassword = data.oldPassword;
    this.newPassword = data.newPassword;
  }

  email: string;
  oldPassword: string;
  newPassword: string;
}