import { OnDestroy, Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable()
export abstract class OnDestroyCleanup implements OnDestroy {
  private destroyed = new Subject();

  protected get destroyed$(): Observable<any> {
    return this.destroyed.asObservable();
  }

  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
    this.onDestroy();
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  protected onDestroy(): void {}
}
