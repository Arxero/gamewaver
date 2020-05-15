import { IPost } from '../post.entity';

export class UpdatePostCmd implements IPost {
  constructor(data: IPost) {
    this.content = data.content;
    this.title = data.title;
    this.isPublished = data.isPublished;
  }
  content: string;
  title: string;
  isPublished: boolean;
}
