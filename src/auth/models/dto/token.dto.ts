export interface ITokenDto {
  expiresIn: number;
  accessToken: string 
}

export class TokenDto {
  constructor(data: ITokenDto) {
    this.expiresIn = data.expiresIn;
    this.accessToken = data.accessToken;
  }

  expiresIn: number;
  accessToken: string;
}