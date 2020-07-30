import { IDataEntity, DataEntity } from 'src/common/models/data-entity';
import { Entity, Column, ManyToOne } from 'typeorm';
import { User } from 'src/users/models/user.entity';
import { Post } from 'src/posts/models/post.entity';

export interface IComment extends IDataEntity {
  content: string;
  author?: User;
  post?: Post;
}

@Entity({ name: 'comments' })
export class Comment extends DataEntity implements IComment {
  constructor(data: IComment) {
    super();
    if (data) {
      this.id = data.id;
      this.content = data.content;
    }
  }

  @Column({ type: 'varchar', length: 1000, charset: 'utf8mb4', collation: 'utf8mb4_general_ci' })
  content: string;

  @ManyToOne(() => User, author => author.posts)
  author: User;

  @ManyToOne(() => Post, post => post.comments)
  post: Post;
}
