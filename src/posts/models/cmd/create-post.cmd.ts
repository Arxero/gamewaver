import { IPost } from '../post.entity';
import { IsBoolean, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostCmd implements IPost {
  constructor(data: IPost) {
    if (data) {
      this.content = data.content;
      this.title = data.title;
      this.isPublished = data.isPublished;
    }
  }

  @ApiProperty({ minLength: 3, maxLength: 5000 })
  @IsString()
  @Length(3, 5000)
  content: string;

  @ApiProperty({ minLength: 3, maxLength: 100 })
  @IsString()
  @Length(3, 100)
  title: string;

  @ApiProperty()
  @IsBoolean()
  isPublished: boolean;
}
