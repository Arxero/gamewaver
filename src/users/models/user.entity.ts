import { Entity, Column, OneToMany } from 'typeorm';
import { DataEntity, IDataEntity } from 'src/common/models/data-entity';
import { Post } from 'src/posts/models/post.entity';
import { Comment } from 'src/comments/models/comment.entity';
import { PostVote } from 'src/votes/models/postVote.entity';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

export enum UserStatus {
  PENDING = 'pending',
  CONFIRM = 'confirm',
}

export enum UserGender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

export interface IUser extends IDataEntity {
  username: string;
  email: string;
  password: string;
  role: UserRole;
  status: UserStatus;

  avatar?: string;
  summary?: string;
  location?: string;
  gender?: UserGender;
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
      this.summary = data.summary;
      this.location = data.location;
      this.gender = data.gender;
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

  @Column({ nullable: true })
  avatar: string;

  @Column({ nullable: true, charset: 'utf8mb4', collation: 'utf8mb4_general_ci' })
  summary: string;

  @Column({ nullable: true })
  location: string;

  @Column({ nullable: true })
  gender: UserGender;

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

  @OneToMany(
    () => PostVote,
    vote => vote.user,
  )
  votes: PostVote[];
}
