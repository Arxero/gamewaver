export class ForgottenPasswordCmd {
  constructor(email: string) {
    this.email = email;
  };
  email: string;
}