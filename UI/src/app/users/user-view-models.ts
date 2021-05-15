import { User } from './user';

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

export interface UserViewModel extends User {
  joinedAt: string;
  userRole: string;
}

export const usersRoute = 'users';
export const usersProfileRoute = 'profile';
export const usersProfileEditRoute = 'edit';
export const usersProfileFullRoute = (id: string): string => `${usersRoute}/${usersProfileRoute}/${id}`;
