import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private _uiLoading = new BehaviorSubject(false);
  uiLoading$ = this._uiLoading.asObservable();

  setUILoading(loading = true) {
    if (this._uiLoading.getValue() !== loading) {
      this._uiLoading.next(loading);
    }
  }
}
