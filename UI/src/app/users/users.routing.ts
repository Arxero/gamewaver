import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { ProfileEditComponent } from './profile-edit/profile-edit.component';
import { MarkdownModule } from 'ngx-markdown';
import { AuthGuard } from '../guards/auth.guard';

export const usersRoute = 'users';
export const usersProfileRoute = 'profile';
export const usersProfileEditRoute = 'edit';
export const usersProfileFullRoute = () => `../../${usersRoute}/${usersProfileRoute}`;
export const usersProfileEditFullRoute = () => `../../${usersRoute}/${usersProfileEditRoute}`;

const routes: Routes = [
  { path: usersProfileRoute, component: ProfileComponent, canActivate: [AuthGuard] },
  { path: `${usersProfileRoute}/:id`, component: ProfileComponent },
  { path: usersProfileEditRoute, component: ProfileEditComponent, canActivate: [AuthGuard] },
  { path: `${usersProfileEditRoute}/:id`, component: ProfileEditComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes), MarkdownModule.forChild()],
  exports: [RouterModule],
})
export class UsersRoutingModule {}
