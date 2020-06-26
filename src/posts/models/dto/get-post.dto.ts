import { IPost, PostCategory } from '../post.entity';

export class GetPostDto implements IPost {
  constructor(data: IPost) {
    this.content = data.content;
    this.id = data.id;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.authorId = data.author?.id;
    this.category = data.category;
  }

  content: string;
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  authorId: string;
  category: PostCategory;
}
