import { PostCategory } from '../view/post-category';

export interface CreatePostCmd {
  content: string;
  category: PostCategory;
  title?: string;
  isPublished?: boolean;
}
