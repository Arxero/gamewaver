import { DataEntity } from '../../../shared/models/common';

export interface CommentViewModel extends DataEntity {
  content: string;
  authorId: string;
  postId: string;
  authorAvatar: string;
  authorUsername: string;
  date: string;
  tooltipDate: string;
}
