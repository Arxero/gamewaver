import { IPost } from '../post.entity';

export class CreatePostCmd implements IPost {
  constructor(data: IPost) {
    this.content = data.content;
    this.title = data.title;
    this.isPublished = data.isPublished;
  }
  content: string;
  title: string;
  isPublished: boolean;
}
