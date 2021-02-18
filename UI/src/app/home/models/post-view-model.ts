import { postCategories, PostCategory } from './post-category';
import * as moment from 'moment';
import { User, UserRole } from '../../users/user';
import { HomeViewModel, UserActionOnPost, VoteType } from './home-view-model';
import { GetVoteDto, GetPostDto, GetPostDtoEx } from './home.models';

export interface PostViewModel extends HomeViewModel {
  category: PostCategory;
  categoryLabel: string;
  userActionOnPost?: UserActionOnPost;
  comments: number;

  upvotes: number;
  downvotes: number;
  vote: GetVoteDto;
}

export function mapPostViewModel(
  post: GetPostDtoEx,
  userInPosts: User,
  votesDto: GetVoteDto = { type: VoteType.Unknown, postId: null, userId: null },
  userActionOnPost: UserActionOnPost = UserActionOnPost.Unknown,
): PostViewModel {
  const getTooltipDate: {[key: string]: Date} = {
    [UserActionOnPost.Unknown]: post.createdAt,
    [UserActionOnPost.Posted]: post.createdAt,
    [UserActionOnPost.Voted]: post.voteCreated,
  };

  const isUserRole = (role: UserRole): UserRole | null => {
    return (role !== UserRole.USER ? role : null);
  }

  return {
    id: post.id,
    content: post.content,
    authorId: post.authorId,
    avatar: post.avatar ? post.avatar : userInPosts?.avatar,
    username: post.username ? post.username : userInPosts.username,
    date: getTooltipDate[userActionOnPost]?.toString(),
    tooltipDate: moment(getTooltipDate[userActionOnPost]).format('MMMM DD, YYYY [at] hh:mm A'),
    userRole: post.role ? isUserRole(post.role) : isUserRole(userInPosts.role),
    category: post.category,
    categoryLabel: postCategories.find(j => j.value === post.category).label,
    userActionOnPost,
    upvotes: post.upvotes || 0,
    downvotes: post.downvotes || 0,
    comments: post.comments || 0,
    vote: votesDto,
  } as PostViewModel;
}




