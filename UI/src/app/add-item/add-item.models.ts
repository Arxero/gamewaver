import { PostCategory } from '../home/models/post-category';

export interface AddItem {
  isPost: boolean;
  minLength: number;
  maxLength: number;
  content?: string;
  category?: PostCategory;
  id?: string;
  userAvatar?: string;
  userId?: string;
}
