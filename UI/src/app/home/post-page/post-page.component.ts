import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { HomeState } from '../../store/home/home.reducer';
import { ActivatedRoute } from '@angular/router';
import { BaseComponent } from '../../shared/base.component';
import { PostViewModel } from '../models/view/post-view-model';
import { takeUntil, filter } from 'rxjs/operators';
import {
  homeStatePosts,
  usersInPosts,
  homeStatePost,
} from '../../store/home/home.selectors';
import { GetPostAction } from '../../store/home/home.actions';

@Component({
  selector: 'app-post-page',
  templateUrl: './post-page.component.html',
  styleUrls: ['./post-page.component.scss'],
})
export class PostPageComponent extends BaseComponent implements OnInit {
  post: PostViewModel;
  postId: string;

  constructor(private store: Store<HomeState>, private route: ActivatedRoute) {
    super();
    this.postId = this.route.snapshot.params.id;

    store
      .pipe(
        takeUntil(this.destroyed$),
        select(homeStatePosts),
        filter(x => !!x),
      )
      .subscribe(x => {
        this.post = x.find(p => p.id === this.postId);
      });

    store
      .pipe(
        takeUntil(this.destroyed$),
        select(homeStatePost),
        filter(x => !!x),
      )
      .subscribe(x => {
        this.post = this.post ? this.post : x;
      });
  }

  ngOnInit(): void {
    if (!this.post) {
      this.store.dispatch(new GetPostAction({ id: this.postId }));
    }
  }
}
