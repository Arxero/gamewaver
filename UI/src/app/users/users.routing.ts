import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProfileComponent } from './profile.component';
import { ProfileEditComponent } from './profile-edit.component';
import { MarkdownModule } from 'ngx-markdown';
import { AuthGuard } from '../guards/auth.guard';
import { ProfilePostsComponent, UrlProfileData } from './profile-posts.component';
import { UserActionOnPost } from '../home/models';
import { usersProfileRoute, usersProfileEditRoute } from './user-view-models';

const routes: Routes = [
  {
    path: `${usersProfileRoute}/:id`,
    component: ProfileComponent,
    children: [
      {
        path: ``,
        redirectTo: 'posts',
        pathMatch: 'full',
      },
      {
        path: `posts`,
        component: ProfilePostsComponent,
        data: {
          filterFieldName: 'authorId',
          sortPropName: 'createdAt',
          userActionOnPost: UserActionOnPost.Posted
        } as UrlProfileData,
      },
      {
        path: `comments`,
        component: ProfilePostsComponent,
        data: {
          filterFieldName: 'commentAuthor',
          sortPropName: 'commentCreated',
          userActionOnPost: UserActionOnPost.Commented
        } as UrlProfileData,
      },
      {
        path: `votes`,
        component: ProfilePostsComponent,
        data: {
          filterFieldName: 'userId',
          sortPropName: 'voteCreated',
          userActionOnPost: UserActionOnPost.Voted
        } as UrlProfileData,
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
