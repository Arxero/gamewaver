import { DataEntity } from './common';

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

export interface Profile extends DataEntity {
  username: string;
  email: string;
  avatar: string;
  role: UserRole;
  status: UserStatus;

  summary: string;
  location: string;
  gender: UserGender;
}
