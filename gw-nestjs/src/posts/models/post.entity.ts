import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { Comment } from 'src/comments/models/comment.entity';
import { DataEntity, IDataEntity } from 'src/common/models/data-entity';
import { User } from 'src/users/models/user.entity';

export interface IPost extends IDataEntity {
  content: string;
  title: string;
  isPublished: boolean;
}

@Entity({ name: 'posts' })
export class Post extends DataEntity implements IPost {
  constructor(data: IPost) {
    super();
    if (!!data) {
      this.id = data.id;
      this.content = data.content;
      this.title = data.title;
      this.isPublished = data.isPublished;
    }
  }

  @Column({ type: 'varchar', length: 5000 })
  content: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ default: false })
  isPublished: boolean;

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
