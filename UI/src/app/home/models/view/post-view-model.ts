import { DataEntity } from '../../../shared/models/common';

export interface PostViewModel extends DataEntity {
  content: string;
  category: string;
  authorId: string;
  authorAvatar: string;
  authorUsername: string;
}
