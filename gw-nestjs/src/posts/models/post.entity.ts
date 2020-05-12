import { Entity, Column, ManyToOne } from 'typeorm';
import { DataEntity } from 'src/common/models/data-entity';
import { User } from 'src/users/models/user.entity';

@Entity({ name: 'posts' })
export class Post extends DataEntity {
  @Column({ type: 'varchar', length: 5000 })
  content: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ default: false })
  isPublished: boolean;

  @ManyToOne(() => User, author => author.posts)
  author: User;
}
