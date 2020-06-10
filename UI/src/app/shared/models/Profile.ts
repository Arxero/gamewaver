import { DataEntity } from './common';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

export enum UserStatus {
  PENDING = 'pending',
  CONFIRM = 'confirm',
}

export interface Profile extends DataEntity {
  username: string;
  email: string;
  avatar: string;
  role: UserRole;
  status: UserStatus;
}
