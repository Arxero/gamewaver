export class SentEmailDto {
  constructor(data: { message: string; username: string; token: string }) {
    this.message = data.message;
    this.username = data.username;
    this.token = data.token;
  }
  message: string;
  username: string;
  token: string;
}
