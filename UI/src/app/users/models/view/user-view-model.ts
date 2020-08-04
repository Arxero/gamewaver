import { User, UserRole } from '../dto/user';
import * as moment from 'moment';


export interface UserViewModel extends User {
  joinedAt: string;
  userRole: string;
}


export function mapUserViewModel(user: User): UserViewModel {
  return {
    ...user,
    joinedAt: `Joined ${moment(user.createdAt).format('MMMM DD, YYYY [at] hh:mm A')}`,
    userRole: user.role !== UserRole.USER ? user.role : null,
  } as UserViewModel;
}
