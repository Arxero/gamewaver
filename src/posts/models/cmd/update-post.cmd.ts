import { IPost, PostCategory } from '../post.entity';
import { IsString, IsBoolean, Length, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IPostCmd } from './create-post.cmd';

export class UpdatePostCmd implements IPostCmd {
  constructor(data: IPostCmd) {
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
