import { DataEntity } from './common';

export interface Profile extends DataEntity {
  username: string;
  email: string;
  avatar: string;
}
