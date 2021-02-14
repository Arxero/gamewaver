import { BaseDto } from '../../../common/models/base.dto';
import { UserRole } from './../../../users/models/user.entity';
import { IDataEntity } from './../../../common/models/data-entity';
import { IPost, PostCategory } from '../post.entity';
import { User } from 'src/users/models/user.entity';

export interface IPostDtoEx extends IPost {
  upvotes: number;
  downvotes: number;
  comments: number;
  role: UserRole;
  avatar: string;
  username: string;
  authorId: string;
  voteCreated: Date;
}

export class GetPostDto extends BaseDto {
  constructor(data: IPost) {
    super(data);
    this.content = data.content;
    this.category = data.category;
    this.authorId = data.author?.id;
  }

  content: string;
  category: PostCategory;
  authorId: string;
}

export class GetPostDtoEx extends GetPostDto {
  constructor(data: IPostDtoEx) {
    super(data)
    this.upvotes = data.upvotes ? Number(data.upvotes) : 0;
    this.downvotes = data.downvotes ? Number(data.downvotes) : 0;
    this.comments = data.comments ? Number(data.comments) : 0;
    this.role = data.role;
    this.avatar = data.avatar;
    this.username = data.username;
    this.authorId = data.authorId;
    this.voteCreated = data.voteCreated;
  }

  upvotes: number;
  downvotes: number;
  comments: number;
  role: UserRole;
  avatar: string;
  username: string;
  voteCreated: Date;
}
