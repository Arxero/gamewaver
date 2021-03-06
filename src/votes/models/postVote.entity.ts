import { IDataEntity, DataEntity } from "src/common/models/data-entity";
import { Entity, Column, ManyToOne, Unique } from "typeorm";
import { User } from "src/users/models/user.entity";
import { Post } from "src/posts/models/post.entity";

export enum VoteType {
  Upvote = 'upvote',
  DownVote = 'downvote'
}

export interface IVote extends IDataEntity {
  type: VoteType;

  user: User;
  post: Post;
}

@Entity({ name: 'post_votes' })
@Unique(["user", "post"])
export class PostVote extends DataEntity implements IVote {
  constructor(data: IVote) {
    super();
    if (data) {
      this.type = data.type;
      this.user = data.user;
      this.post = data.post;
    }
  }

  @Column()
  type: VoteType;

  @ManyToOne(
    () => User,
    user => user.votes,
  )
  user: User;

  @ManyToOne(
    () => Post,
    post => post.votes,
  )
  post: Post;
}