import { GetCommentDto } from './home.models';
import { HomeViewModel, CommentViewModel } from './home-view-model';
import { User, UserRole } from '../../users/user';
import * as moment from 'moment';



export function mapCommmentViewModel(comment: GetCommentDto, userInPosts: User): CommentViewModel{
  return {
    ...comment,
    avatar: userInPosts.avatar,
    username: userInPosts.username,
    date: comment.createdAt.toString(),
    tooltipDate: moment(comment.createdAt).format(
      'MMMM DD, YYYY [at] hh:mm A',
    ),
    userRole: userInPosts.role !== UserRole.USER ? userInPosts.role : null,
  } as CommentViewModel;
}

