import { GetVoteDto } from './../dto/get-vote.dto';
import { DataEntity } from '../../../shared/models/common';
import { GetPostDto } from '../dto/get-post.dto';
import { postCategories, PostCategory } from './post-category';
import * as moment from 'moment';
import { User, UserRole } from '../../../users/models/dto/user';
import { HomeViewModel, UserActionOnPost, VoteType } from './home-view-model';
import { GetCommentsCountDto } from '../dto/get-comments-count.dto';

export interface PostViewModel extends HomeViewModel {
  category: string;
  categoryEnum: PostCategory;
  userActionOnPost?: UserActionOnPost;
  commentsCount?: number;

  upvotes: number;
  downvotes: number;
  voteType: VoteType;
  upvoteColor: string;
  downvoteColor: string;
}

export function mapPostViewModel(
  post: GetPostDto,
  userInPosts: User,
  votesDto?: GetVoteDto[],
  userActionOnPost?: UserActionOnPost,
  commentsCount?: GetCommentsCountDto[],
): PostViewModel {
  const foundType = votesDto?.find(x => x.postId === post.id)?.type;
  return {
    ...post,
    authorAvatar: userInPosts.avatar,
    authorUsername: userInPosts.username,
    category: postCategories.find(j => j.value === post.category).label,
    date: post.createdAt.toString(),
    tooltipDate: moment(post.createdAt).format('MMMM DD, YYYY [at] hh:mm A'),
    categoryEnum: post.category,
    userActionOnPost,
    userRole: userInPosts.role !== UserRole.USER ? userInPosts.role : null,
    commentsCount: commentsCount?.find(x => x.postId === post.id).count,
    voteType: foundType,
    upvoteColor: foundType === VoteType.Upvote ? 'primary' : '',
    downvoteColor: foundType === VoteType.DownVote ? 'primary' : '',
  } as PostViewModel;
}
