import { IPost, PostCategory } from '../post.entity';
import { User } from 'src/users/models/user.entity';

export interface IPostDto extends IPost {
  voteCreated?: Date;
  authorId?: string;
}

export class GetPostDto implements IPostDto {
  constructor(data: IPostDto) {
    this.content = data.content;
    this.id = data.id;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.authorId = data.author?.id || data.authorId;
    this.category = data.category;
    this.upvotes = data.upvotes;
    this.downvotes = data.downvotes;
    this.voteCreated = data.voteCreated;
  }
  voteCreated?: Date;
  author?: User;

  content: string;
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  votedAt?: Date;
  category: PostCategory;
  authorId: string;

  upvotes: number;
  downvotes: number;
}
