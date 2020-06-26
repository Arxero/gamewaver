import { IPost, PostCategory } from '../post.entity';
import { IsBoolean, IsString, Length, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostCmd implements IPost {
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
