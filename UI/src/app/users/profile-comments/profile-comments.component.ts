import { EnvironmentService } from './../../services/environment.service';
import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../shared/base.component';
import { Store, select } from '@ngrx/store';
import { HomeState } from '../../store/home/home.reducer';
import { ActivatedRoute, Router } from '@angular/router';
import { PostViewModel } from '../../home/models/view/post-view-model';
import { User } from '../models/dto/user';
import { PostContext } from '../../home/models/view/home-view-model';
import { SearchType } from '../../shared/models/common';
import {
  GetCommentsAction,
  ClearPostsAction,
  ClearPostAction,
} from '../../store/home/home.actions';
import { CommentViewModel } from '../../home/models/view/comment-view-model';
import { takeUntil, filter } from 'rxjs/operators';
import { userProfile } from '../../store/auth/auth.selectors';
import { homeStatePostComments } from '../../store/home/home.selectors';
import { Observable } from 'rxjs';
import { UserViewModel } from '../models/view/user-view-model';

@Component({
  selector: 'app-profile-comments',
  templateUrl: './profile-comments.component.html',
  styleUrls: ['./profile-comments.component.scss'],
})
export class ProfileCommentsComponent extends BaseComponent implements OnInit {
  comments: CommentViewModel[] = [];
  user$: Observable<UserViewModel>;
  get postContext() {
    return PostContext;
  }
  postContextUrl: PostContext;
  userId: string;

  constructor(
    private store: Store<HomeState>,
    private route: ActivatedRoute,
    private router: Router,
    private environmentService: EnvironmentService,
  ) {
    super();
    this.userId = this.route.parent.snapshot.params.id;
    this.user$ = store.pipe(select(userProfile));
    store
      .pipe(
        takeUntil(this.destroyed$),
        select(homeStatePostComments),
        filter(x => !!x),
      )
      .subscribe(x => {
        this.comments = x;
      });
  }

  ngOnInit(): void {
    this.getComments();
  }

  onScrollDown(): void {
    this.getComments();
  }

  onDestroy() {
    this.store.dispatch(new ClearPostsAction());
    this.store.dispatch(new ClearPostAction());
  }

  private getComments() {
    const commentsFilter = {
      fieldName: 'author',
      searchOperator: SearchType.Equal,
      searchValue: this.userId,
    };

    this.store.dispatch(
      new GetCommentsAction({
        paging: {
          skip: this.comments.length,
          take: this.environmentService.take,
        },
        filters: [commentsFilter],
      }),
    );
  }
}
