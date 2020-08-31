import { IPost, PostCategory } from '../post.entity';
import { GetVotesCountDto } from 'src/votes/models/dto/get-votes-count.dto';
import { User } from 'src/users/models/user.entity';

export class GetPostDto implements IPost {
  constructor(data: IPost) {
    this.content = data.content;
    this.id = data.id;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.authorId = data.author?.id;
    this.category = data.category;
    this.upvotes = data.upvotes;
    this.downvotes = data.downvotes;
  }

  content: string;
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  category: PostCategory;
  authorId: string;

  upvotes: number;
  downvotes: number;
}
