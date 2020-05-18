import { IPost } from '../post.entity';

export class GetPostDto implements IPost {
  constructor(data: IPost) {
    this.content = data.content;
    this.title = data.title;
    this.isPublished = data.isPublished;
    this.id = data.id;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.authorId = data.author?.id;
  }

  content: string;
  title: string;
  isPublished: boolean;
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  authorId: string;
}
