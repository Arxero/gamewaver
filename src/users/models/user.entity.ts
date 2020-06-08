import { Entity, Column, OneToMany } from 'typeorm';
import { DataEntity, IDataEntity } from 'src/common/models/data-entity';
import { Post } from 'src/posts/models/post.entity';
import { Comment } from 'src/comments/models/comment.entity';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

export enum UserStatus {
  PENDING = 'pending',
  CONFIRM = 'confirm',
}

export interface IUser extends IDataEntity {
  username?: string;
  email?: string;
  password?: string;
  role?: UserRole;
  status?: UserStatus;
  avatar?: string;
}

@Entity({ name: 'users' })
export class User extends DataEntity implements IUser {
  constructor(data: IUser) {
    super();
    if (data) {
      this.id = data.id;
      this.username = data.username;
      this.email = data.email;
      this.password = data.password;
      this.role = data.role;
      this.status = data.status;
      this.avatar = data.avatar;
    }
  }

  @Column({ type: 'varchar', length: 20, unique: true })
  username: string;

  @Column({ type: 'varchar', length: 30, unique: true })
  email: string;

  @Column({ type: 'text' })
  password: string;

  @Column()
  role: UserRole;

  @Column()
  status: UserStatus;

  @Column({nullable: true})
  avatar: string;

  @OneToMany(
    () => Post,
    post => post.author,
  )
  posts: Post[];

  @OneToMany(
    () => Comment,
    comment => comment.author,
  )
  comments: Comment[];
}
