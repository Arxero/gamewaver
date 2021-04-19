import { SidebarNavigation } from './../../sidebar/sidebar-view.models';
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable()
export class SidebarNavigationService {
  private _sidebarNavigation: SidebarNavigation;
  private _sidebarNavigationSubject = new Subject<SidebarNavigation>();

  get navigation$(): Observable<SidebarNavigation> {
    return this._sidebarNavigationSubject.asObservable();
  }

  set navigation(value: SidebarNavigation) {
    this._sidebarNavigation = value;
    this._sidebarNavigationSubject.next(this._sidebarNavigation);
  }
}
