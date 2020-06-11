export interface TokenDto {
  expiresIn: number;
  accessToken: string;
}

export interface TokenLocal extends TokenDto {
  savedAt: number;
}

