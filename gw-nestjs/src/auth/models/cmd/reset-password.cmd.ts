export class ResetPasswordCmd {
  constructor(data: { password: string; token: string }) {
    this.password = data.password;
    this.token = data.token;
  }
  password: string;
  token: string;
}