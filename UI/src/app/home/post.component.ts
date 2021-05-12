import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UserRole, User } from '../users/user';
import { PostContext, VoteType, PostViewModel } from './models/home-view-model';
import { Router } from '@angular/router';
import { Clipboard } from '@angular/cdk/clipboard';
import { SnackbarService } from '../services/snackbar.service';
import { ViewportScroller } from '@angular/common';
import { PostVoteCmd } from './models/home.models';
import { ScrollPositionService } from './services/scroll-position.service';
import { PostsService } from './services/posts.service';
import { VotesService } from './services/votes.service';
import { SidebarNavigationService } from './services/sidebar-navigation.service';
import { SidebarNavigation } from '../sidebar/sidebar-view.models';
import { loginFullRoute } from '../auth/auth.models';
import { usersProfileFullRoute } from '../users/user-view-models';
import { UserInfoContext, UserInfo } from '@gamewaver/shared';

@Component({
  selector: 'gw-post',
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

  voteType = VoteType;
  userActionOnPost: string;
  canEditOrDelete: boolean;
  postContexts = PostContext;

  get userProfileRoute(): string {
    return this.postContext === PostContext.PostPage
      ? `../../${usersProfileFullRoute(this.post.authorId)}`
      : `../${usersProfileFullRoute(this.post.authorId)}`;
  }

  get userInfo(): UserInfo {
    return {
      id: this.post.authorId,
      avatar: this.post.avatar,
      username: this.post.username,
      role: this.post.userRole,
      link: [this.userProfileRoute]
    }
  }

  get isProfilePage(): boolean {
    return this.postContext === this.postContexts.ProfilePage;
  }

  get userInfoContext(): UserInfoContext {
    if (this.postContext === this.postContexts.ProfilePage) {
      return UserInfoContext.ProfilePost;
    }

    return UserInfoContext.Post;
  }

  constructor(
    private router: Router,
    private clipboard: Clipboard,
    private snackbarService: SnackbarService,
    private viewportScroller: ViewportScroller,
    private scrollPositionService: ScrollPositionService,
    private postsService: PostsService,
    private votesService: VotesService,
    private sidebarNavigationService: SidebarNavigationService
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
    this.postsService.postContext = this.postContext;
    this.postsService.delete(this.post.id);
  }

  navigate() {
    this.sidebarNavigationService.navigation = SidebarNavigation.Post;
    this.router.navigateByUrl(`?filters=category!eq!${this.post.category}`);
  }

  onCopyLink() {
    this.clipboard.copy(window.location.origin + '/post/' + this.post.id);
    this.snackbarService.showInfo('Link Copied.');
  }

  onPostLink() {
    this.scrollPositionService.scrollPosition = this.viewportScroller.getScrollPosition();
  }

  onVote(voteType: VoteType) {
    if (!this.user) {
      return this.router.navigateByUrl(loginFullRoute());
    }

    const cmd: PostVoteCmd = {
      postId: this.post.id,
      type: voteType,
    };

    switch (this.post.vote?.type) {
      // user already have vote and clicks to remove it
      case VoteType.Upvote:
      case VoteType.DownVote:
        this.votesService.delete(this.post.vote.id);
        break;

      default:
        this.votesService.create(cmd);
        break;
    }
  }
}
