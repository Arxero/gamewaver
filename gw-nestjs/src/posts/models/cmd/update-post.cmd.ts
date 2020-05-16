import { IPost } from '../post.entity';
import { IsNotEmpty, IsString, IsBoolean } from 'class-validator';

export class UpdatePostCmd implements IPost {
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
