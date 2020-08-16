import { Injectable, HttpService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RecaptchResponse } from '../models/recaptcha-response';

export interface ReCaptchaCmd {
  secret: string;
  response: string;
  remoteip?: string;
}

@Injectable()
export class RecaptchaService {
  constructor(
    private configService: ConfigService,
    private httpService: HttpService,
  ) {}

  async validateRecaptcha(token: string): Promise<RecaptchResponse> {
    const secret = this.configService.get<string>('secrets.recaptcha');
    const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${token}`;

    try {
      const { data } = await this.httpService.get(url).toPromise();
      return new RecaptchResponse(data);
    } catch (error) {
      throw new Error(JSON.stringify(error));
    }
  }
}
