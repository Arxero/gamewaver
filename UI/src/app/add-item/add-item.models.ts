import { PostCategory } from '@gamewaver/shared';

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
