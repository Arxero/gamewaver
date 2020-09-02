import { DataEntity } from '../../../shared/models/common';
import { PostCategory } from '../view/post-category';

export interface GetPostDto extends DataEntity {
  content: string;
  title: string;
  category: PostCategory;
  authorId: string;

  upvotes: number;
  downvotes: number;
}
