import { IPost, PostCategory } from '../post.entity';
import { IsString, IsBoolean, Length, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePostCmd implements IPost {
  constructor(data: IPost) {
    if (data) {
      this.content = data.content;
      this.category = data.category;
    }
  }

  @ApiProperty({ minLength: 3, maxLength: 5000 })
  @IsString()
  @Length(3, 5000)
  content: string;

  @ApiProperty()
  @IsEnum(PostCategory)
  category: PostCategory;
}
