import { PostCategory } from '../view/post-category';

export interface UpdatePostCmd {
  content: string;
  category: PostCategory;
}
