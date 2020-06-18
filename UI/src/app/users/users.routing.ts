import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { ProfileEditComponent } from './profile-edit/profile-edit.component';
import { MarkdownModule } from 'ngx-markdown';

export const usersRoute = 'users';

const routes: Routes = [
  { path: 'profile', component: ProfileComponent },
  { path: 'edit', component: ProfileEditComponent },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    MarkdownModule.forChild(),
  ],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
