import { DataEntity } from '../../../shared/models/common';
import { GetPostDto } from '../dto/get-post.dto';
import { postCategories, PostCategory } from './post-category';
import * as moment from 'moment';
import { User, UserRole } from '../../../users/models/dto/user';
import { HomeViewModel, UserActionOnPost } from './home-view-model';

export interface PostViewModel extends HomeViewModel {
  category: string;
  categoryEnum: PostCategory;
  userActionOnPost?: UserActionOnPost;
}

export function mapPostViewModel(
  post: GetPostDto,
  userInPosts: User,
  userActionOnPost?: UserActionOnPost,
): PostViewModel {
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
  } as PostViewModel;
}
