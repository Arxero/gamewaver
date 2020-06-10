import { OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

export class BaseComponent implements OnDestroy {

  protected destroyed$ = new Subject<any>();

  ngOnDestroy(): void {
    this.destroyed$.next({});
    this.destroyed$.complete();
    this.onDestroy();
  }

  protected onDestroy(): void {
  }
}
