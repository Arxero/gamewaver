import { IPost } from '../post.entity';
import { IsNotEmpty, IsBoolean, IsString } from 'class-validator';

export class CreatePostCmd implements IPost {
  constructor(data: IPost) {
    if (data) {
      this.content = data.content;
      this.title = data.title;
      this.isPublished = data.isPublished;
    }
  }

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsBoolean()
  isPublished: boolean;
}
