import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { Comment } from 'src/comments/models/comment.entity';
import { DataEntity, IDataEntity } from 'src/common/models/data-entity';
import { User } from 'src/users/models/user.entity';

export enum PostCategory {
  IMAGE = 'image',
  VIDEO = 'video',
  BLOG_POST = 'blog_post',
  MEME = 'meme',
  NSFW = 'nsfw',
  OTHE = 'other'
}

export interface IPost extends IDataEntity {
  content: string;
  category: PostCategory;
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
    }
  }

  @Column({ type: 'varchar', length: 5000 })
  content: string;

  @Column()
  category: PostCategory;

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
}
