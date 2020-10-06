import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { Comment } from 'src/comments/models/comment.entity';
import { DataEntity, IDataEntity } from 'src/common/models/data-entity';
import { User } from 'src/users/models/user.entity';
import { PostVote } from 'src/votes/models/postVote.entity';

export enum PostCategory {
  IMAGE = 'image',
  VIDEO = 'video',
  BLOG_POST = 'blog_post',
  MEME = 'meme',
  NSFW = 'nsfw',
  OTHE = 'other',
}

export interface IPost extends IDataEntity {
  content: string;
  category: PostCategory;
  upvotes?: number;
  downvotes?: number;
  author?: User;
}

@Entity({ name: 'posts' })
export class Post extends DataEntity implements IPost {
  constructor(data: IPost) {
    super();
    if (data) {
      this.id = data.id;
      this.content = data.content;
      this.category = data.category;
      this.upvotes = data.upvotes;
      this.downvotes = data.downvotes;
    }
  }

  @Column({
    type: 'varchar',
    length: 5000,
    charset: 'utf8mb4',
    collation: 'utf8mb4_general_ci',
  })
  content: string;

  @Column()
  category: PostCategory;

  @Column({ default: 0 })
  upvotes: number;

  @Column({ default: 0 })
  downvotes: number;

  @ManyToOne(
    () => User,
    author => author.posts,
  )
  author: User;

  @OneToMany(
    () => Comment,
    comment => comment.post,
  )
  comments: Comment[];

  @OneToMany(
    () => PostVote,
    vote => vote.post,
  )
  votes: PostVote[];
}
