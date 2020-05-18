export class TokenDto {
  constructor(data: { expiresIn?: number; accessToken?: string }) {
    this.expiresIn = data.expiresIn;
    this.accessToken = data.accessToken;
  }

  expiresIn: number;
  accessToken: string;
}