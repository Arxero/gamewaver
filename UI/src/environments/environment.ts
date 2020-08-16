// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { IEnvironment } from '../app/shared/models/ienvironment';

export const environment: IEnvironment = {
  production: false,
  apiUrl: 'http://localhost:81/',
  uploadApiUrl: 'https://api.imgur.com/3/image',
  uploadApiClientId: '7cb4e66dbbd970c',
  reCaptchaSiteKey: '6LdPhL8ZAAAAAKo752upfgxLGSUWE_QJtxvUjbQV',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
