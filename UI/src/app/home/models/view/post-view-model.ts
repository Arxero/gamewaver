import { DataEntity } from '../../../shared/models/common';
import { GetPostDto } from '../dto/get-post.dto';
import { postCategories, PostCategory } from './post-category';
import * as moment from 'moment';
import { User } from '../../../users/models/dto/user';
import { HomeViewModel } from './home-view-model';

export interface PostViewModel extends HomeViewModel {
  category: string;
  categoryEnum: PostCategory;
}

export function mapPostViewModel(post: GetPostDto, userInPosts: User): PostViewModel{
  return {
    ...post,
    authorAvatar: userInPosts.avatar,
    authorUsername: userInPosts.username,
    category: postCategories.find(j => j.value === post.category).label,
    date: post.createdAt.toString(),
    tooltipDate: moment(post.createdAt).format(
      'MMMM DD, YYYY [at] hh:mm A',
    ),
    categoryEnum: post.category
  } as PostViewModel;
}
