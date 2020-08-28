import { IPost, PostCategory } from '../post.entity';
import { GetVotesCountDto } from 'src/votes/models/dto/get-votes-count.dto';

export class GetPostDto implements IPost {
  constructor(data: IPost, votes?: GetVotesCountDto) {
    this.content = data.content;
    this.id = data.id;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.authorId = data.author?.id;
    this.category = data.category;
    this.votes = votes;
  }

  content: string;
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  authorId: string;
  category: PostCategory;
  votes: GetVotesCountDto;
}
