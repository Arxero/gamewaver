export interface TokenDto {
  expiresIn: number;
  accessToken: string;
  imgurClientId: string;
}

export interface TokenLocal extends TokenDto {
  savedAt: number;
}

