import { loginFullRoute } from '../auth/auth.routing';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { usersProfileFullRoute } from '../users/users.routing';
import {
  DeletePostAction,
  SetPostPagePost,
  DeletePostUpvoteAction,
  CreatePostUpvoteAction,
  SaveScrollPositionAction,
} from '../store/home/home.actions';
import { Store } from '@ngrx/store';
import { HomeState } from '../store/home/home.reducer';
import { UserRole, User } from '../users/user';
import { PostContext, VoteType, PostViewModel } from './models/home-view-model';
import { Router } from '@angular/router';
import { Clipboard } from '@angular/cdk/clipboard';
import { SnackbarService } from '../services/snackbar.service';
import { ViewportScroller } from '@angular/common';
import { CreatePostVoteCmd } from './models/home.models';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
})
export class PostComponent implements OnInit {
  @Input() post: PostViewModel;
  @Input() postContext: PostContext;
  @Input() user: User;
  @Output() editPost: EventEmitter<void> = new EventEmitter();
  postRoute: { [key: number]: string } = {
    [PostContext.PostsPage]: `post`,
    [PostContext.ProfilePage]: '../../../../post',
  };

  get voteType() {
    return VoteType;
  }

  userActionOnPost: string;
  canEditOrDelete: boolean;
  get postContexts() {
    return PostContext;
  }

  get userProfileRoute(): string {
    return this.postContext === PostContext.PostPage
      ? `../../${usersProfileFullRoute()}`
      : `../${usersProfileFullRoute()}`;
  }

  constructor(
    private store: Store<HomeState>,
    private router: Router,
    private clipboard: Clipboard,
    private snackbarService: SnackbarService,
    private viewportScroller: ViewportScroller,
  ) {}

  ngOnInit(): void {
    if (!this.user) {
      return;
    }

    this.canEditOrDelete =
      this.user.id === this.post?.authorId || this.user.role === UserRole.ADMIN
        ? true
        : false;
  }

  onEdit() {
    this.editPost.emit();
  }

  onDelete() {
    this.store.dispatch(
      new DeletePostAction({ id: this.post.id, postContext: this.postContext }),
    );
  }

  navigate() {
    this.router.navigateByUrl(`?filters=category!eq!${this.post.category}`);
  }

  onCopyLink() {
    this.clipboard.copy(window.location.origin + '/post/' + this.post.id);
    this.snackbarService.showInfo('Link Copied.');
  }

  onPostLink() {
    this.store.dispatch(new SaveScrollPositionAction({ data: this.viewportScroller.getScrollPosition()}));
    this.store.dispatch(new SetPostPagePost({ data: this.post }));
  }

  onVote(voteType: VoteType) {
    if (!this.user) {
      return this.router.navigateByUrl(loginFullRoute());
    }

    const cmd: CreatePostVoteCmd = {
      postId: this.post.id,
      type: voteType,
    };

    switch (this.post.vote.type) {
      // user already have vote and clicks to remove it
      case VoteType.Upvote:
      case VoteType.DownVote:
        this.store.dispatch(new DeletePostUpvoteAction({ id: this.post.vote.id }));
        break;

      default:
        this.store.dispatch(new CreatePostUpvoteAction({ cmd }));
        break;
    }
  }
}
