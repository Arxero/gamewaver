import { DataEntity } from '../../../shared/models/common';
import { GetPostDto } from '../dto/get-post.dto';
import { postCategories } from './post-category';
import * as moment from 'moment';
import { User } from '../../../users/models/dto/user';

export interface PostViewModel extends DataEntity {
  content: string;
  category: string;
  authorId: string;
  authorAvatar: string;
  authorUsername: string;
  date: string;
  tooltipDate: string;
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
  } as PostViewModel;
}
