import { Entity, Column, OneToMany } from 'typeorm';
import { DataEntity } from 'src/models/DataEntity';
import { Post } from 'src/posts/models/post.entity';

@Entity({ name: 'users' })
export class User extends DataEntity {
  @Column({ type: 'varchar', length: 50 })
  username: string;

  @Column({ type: 'varchar', length: 50 })
  email: string;

  @Column({ type: 'text'})
  password: string;

  @OneToMany(() => Post, post => post.author)
  posts: Post[];
}
