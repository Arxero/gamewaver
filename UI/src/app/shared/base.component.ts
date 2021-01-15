import { OnDestroy, Directive } from '@angular/core';
import { Subject } from 'rxjs';

// TODO: Add Angular decorator.
@Directive()
// tslint:disable-next-line: directive-class-suffix
export class BaseComponent implements OnDestroy {
  protected destroyed$ = new Subject<any>();

  ngOnDestroy(): void {
    this.destroyed$.next({});
    this.destroyed$.complete();
    this.onDestroy();
  }

  protected onDestroy(): void {}
}
