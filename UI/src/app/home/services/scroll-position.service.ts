import { Injectable } from '@angular/core';
import { Subject, Observable, BehaviorSubject } from 'rxjs';

@Injectable()
export class ScrollPositionService {
  private _scrollPositionSubject = new BehaviorSubject<[number, number]>([0, 0]);
  private _scrollPosition: [number, number];

  get scrollPosition$(): Observable<[number, number]> {
    return this._scrollPositionSubject.asObservable();
  }

  set scrollPosition(value: [number, number]) {
    this._scrollPosition = value;
    this._scrollPositionSubject.next(this._scrollPosition);
  }
}
