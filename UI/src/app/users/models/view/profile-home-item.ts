import { PostViewModel } from '../../../home/models/view/post-view-model';
import { CommentViewModel } from '../../../home/models/view/comment-view-model';

export interface ProfileHomeItem {
  date: Date;
  post?: PostViewModel;
  comment?: CommentViewModel;
}
