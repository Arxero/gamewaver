import { postCategories, PostCategory } from './post-category';
import * as moment from 'moment';
import { User, UserRole } from '../../users/user';
import { HomeViewModel, UserActionOnPost, VoteType } from './home-view-model';
import { GetVoteDto, GetPostDto } from './home.models';

export interface PostViewModel extends HomeViewModel {
  category: string;
  categoryEnum: PostCategory;
  userActionOnPost?: UserActionOnPost;
  commentsCount: number;

  upvotes: number;
  downvotes: number;
  vote: GetVoteDto;
  voteCreated: Date;
}

export function mapPostViewModel(
  post: GetPostDto,
  userInPosts: User,
  votesDto: GetVoteDto = { type: VoteType.Unknown, postId: null, userId: null },
  userActionOnPost: UserActionOnPost = UserActionOnPost.Unknown,
  commentsCount: number = 0,
): PostViewModel {
  const getTooltipDate: {[key: string]: Date} = {
    [UserActionOnPost.Unknown]: post.createdAt,
    [UserActionOnPost.Posted]: post.createdAt,
    [UserActionOnPost.Voted]: post.voteCreated,
  };

  return {
    ...post,
    authorAvatar: userInPosts.avatar,
    authorUsername: userInPosts.username,
    category: postCategories.find(j => j.value === post.category).label,
    date: getTooltipDate[userActionOnPost].toString(),
    tooltipDate: moment(getTooltipDate[userActionOnPost]).format('MMMM DD, YYYY [at] hh:mm A'),
    categoryEnum: post.category,
    userActionOnPost,
    userRole: userInPosts.role !== UserRole.USER ? userInPosts.role : null,
    commentsCount,
    vote: votesDto,
    voteCreated: post.voteCreated,
  } as PostViewModel;
}
