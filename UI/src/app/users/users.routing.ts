import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { ProfileEditComponent } from './profile-edit/profile-edit.component';
import { MarkdownModule } from 'ngx-markdown';
import { AuthGuard } from '../guards/auth.guard';
import { ProfilePostsComponent } from './profile-posts/profile-posts.component';
import { ProfileCommentsComponent } from './profile-comments/profile-comments.component';

export const usersRoute = 'users';
export const usersProfileRoute = 'profile';
export const usersProfileEditRoute = 'edit';
export const usersProfileFullRoute = () => `${usersRoute}/${usersProfileRoute}`;
export const usersProfileEditFullRoute = () =>
  `../../${usersRoute}/${usersProfileEditRoute}`;

const routes: Routes = [
  {
    path: `${usersProfileRoute}/:id`,
    component: ProfileComponent,
    children: [
      {
        path: ``,
        component: ProfilePostsComponent,
      },
      {
        path: `posts`,
        component: ProfilePostsComponent,
      },
      {
        path: `comments`,
        component: ProfileCommentsComponent,
      },
    ],
  },
  {
    path: `${usersProfileRoute}/:id/${usersProfileEditRoute}`,
    component: ProfileEditComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), MarkdownModule.forChild()],
  exports: [RouterModule],
})
export class UsersRoutingModule {}
