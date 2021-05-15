import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { IEnvironment } from '@gamewaver/shared';

@Injectable({
  providedIn: 'root',
})
export class EnvironmentService implements IEnvironment {
  get production(): boolean {
    return environment.production;
  }

  get apiUrl(): string {
    return environment.apiUrl;
  }

  get uploadApiUrl(): string {
    return environment.uploadApiUrl;
  }

  get uploadApiClientId(): string {
    return environment.uploadApiClientId;
  }

  get reCaptchaSiteKey(): string {
    return environment.reCaptchaSiteKey;
  }

  get take(): number {
    return environment.take;
  }
}
