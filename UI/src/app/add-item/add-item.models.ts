import { PostCategory } from '../home/models/post-category';

export interface AddItem {
  isPost: boolean;
  minLength: number;
  maxLength: number;
  content?: string;
  category?: PostCategory;
  id?: string;
  postId?: string;
  userAvatar?: string;
}
