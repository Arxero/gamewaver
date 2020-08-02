import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  constructor() { }

  private uiLoading = new BehaviorSubject(false);
  public uiLoading$ = this.uiLoading.asObservable();

  public setUILoading(loading = true) {
    if (this.uiLoading.getValue() !== loading) {
      this.uiLoading.next(loading);
    }
  }
}
