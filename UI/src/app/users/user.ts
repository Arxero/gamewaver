import { DataEntity } from '../shared/models/common';

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

export interface User extends DataEntity {
  username: string;
  email: string;
  role: UserRole;
  status: UserStatus;

  avatar: string;
  summary: string;
  location: string;
  gender: UserGender;
}

export interface UpdateUserCmd {
  email: string;
  avatar: string;
  summary: string;
  location: string;
  gender: UserGender;
}

