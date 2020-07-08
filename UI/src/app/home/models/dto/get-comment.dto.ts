import { DataEntity } from '../../../shared/models/common';

export interface GetCommentDto extends DataEntity {
  content: string;
  authorId: string;
  postId: string;
}
