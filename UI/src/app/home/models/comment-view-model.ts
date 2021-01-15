import { GetCommentDto } from './home.models';
import { HomeViewModel } from './home-view-model';
import { User, UserRole } from '../../users/user';
import * as moment from 'moment';

export interface CommentViewModel extends HomeViewModel {
  postId: string;
}

export function mapCommmentViewModel(comment: GetCommentDto, userInPosts: User): CommentViewModel{
  return {
    ...comment,
    authorAvatar: userInPosts.avatar,
    authorUsername: userInPosts.username,
    date: comment.createdAt.toString(),
    tooltipDate: moment(comment.createdAt).format(
      'MMMM DD, YYYY [at] hh:mm A',
    ),
    userRole: userInPosts.role !== UserRole.USER ? userInPosts.role : null,
  } as CommentViewModel;
}

