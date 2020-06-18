import { Injectable } from '@angular/core';
import { IEnvironment } from '../shared/models/ienvironment';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root',
})
export class EnvironmentService implements IEnvironment {
  get production() {
    return environment.production;
  }

  get apiUrl() {
    return environment.apiUrl;
  }

  constructor() {}
}
