import { Module, HttpModule } from '@nestjs/common';
import { RecaptchaService } from './recaptcha.service';
import { BaseService } from './base.service';

@Module({})
export class SharedModule {
  imports: [HttpModule];
  exports: [RecaptchaService, BaseService];
  providers: [RecaptchaService, BaseService];
}
