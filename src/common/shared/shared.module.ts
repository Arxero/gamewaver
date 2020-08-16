import { Module, HttpModule } from '@nestjs/common';
import { RecaptchaService } from './recaptcha.service';

@Module({})
export class SharedModule {
  imports: [HttpModule];
  exports: [RecaptchaService];
  providers: [RecaptchaService];
}
