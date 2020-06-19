export class SentEmailDto {
  constructor(data: { message: string; username: string;}) {
    this.message = data.message;
    this.username = data.username;
  }
  message: string;
  username: string;
}
