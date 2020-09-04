import { CreatePostVoteCmd } from './../../home/models/cmd/create-vote.cmd';
import { switchMap } from 'rxjs/operators';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { usersProfileFullRoute } from '../../users/users.routing';
import {
  DeletePostAction,
  SetPostPagePost,
  DeletePostUpvoteAction,
  CreatePostUpvoteAction,
} from '../../store/home/home.actions';
import { Store } from '@ngrx/store';
import { HomeState } from '../../store/home/home.reducer';
import { UserRole, User } from '../../users/models/dto/user';
import { PostViewModel } from '../../home/models/view/post-view-model';
import { PostContext, VoteType } from '../../home/models/view/home-view-model';
import { Router } from '@angular/router';
import { Clipboard } from '@angular/cdk/clipboard';
import { SnackbarService } from '../../services/snackbar.service';

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
    this.router.navigateByUrl(`?filters=category!eq!${this.post.categoryEnum}`);
  }

  onCopyLink() {
    this.clipboard.copy(window.location.origin + '/post/' + this.post.id);
    this.snackbarService.showInfo('Link Copied.');
  }

  onPostLink() {
    this.store.dispatch(new SetPostPagePost({ data: this.post }));
  }

  onVote(voteType: VoteType) {
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
