import { CommentViewModel } from './../home/models/home-view-model';
import { User, UserRole } from './user';
import * as moment from 'moment';
import { PostViewModel } from '../home/models/post-view-model';

export interface NavLink {
  label: string;
  link: string;
}

export const navLinks: NavLink[] = [
  // {
  //   label: 'Home',
  //   link: './',
  // },
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
  defaultAvatar: string;
}

export function mapUserViewModel(user: User): UserViewModel {
  return {
    ...user,
    joinedAt: `Joined ${moment(user.createdAt).format('MMMM DD, YYYY [at] hh:mm A')}`,
    userRole: user.role !== UserRole.USER ? user.role : null,
    defaultAvatar: '/assets/images/common/no_avatar.jpg',
  } as UserViewModel;
}
