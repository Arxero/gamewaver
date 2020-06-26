import { PostCategory } from '../post-category';

export interface CreatePostCmd {
  content: string;
  category: PostCategory;
  title?: string;
  isPublished?: boolean;
}
