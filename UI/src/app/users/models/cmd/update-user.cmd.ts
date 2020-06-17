import { UserGender } from '../dto/user';

export interface UpdateUserCmd {
  email: string;
  avatar: string;
  summary: string;
  location: string;
  gender: UserGender;
}
