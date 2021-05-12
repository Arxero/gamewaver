import { CommentViewModel, PostViewModel } from './../home/models/home-view-model';
import { User, UserRole } from './user';
import * as moment from 'moment';

export interface NavLink {
  label: string;
  link: string;
}

export const navLinks: NavLink[] = [
  {
    label: 'Posts',
    link: 'posts',
  },
  {
    label: 'Comments',
    link: 'comments',
  },
  {
    label: 'Votes',
    link: 'votes',
  },
];

export interface ProfileHomeItem {
  date: Date;
  post?: PostViewModel;
  comment?: CommentViewModel;
}

export interface UserViewModel extends User {
  joinedAt: string;
  userRole: string;
}

export const usersRoute = 'users';
export const usersProfileRoute = 'profile';
export const usersProfileEditRoute = 'edit';
export const usersProfileFullRoute = (id: string) => `${usersRoute}/${usersProfileRoute}/${id}`;
