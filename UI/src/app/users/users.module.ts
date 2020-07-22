import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersRoutingModule } from './users.routing';
import { SharedModule } from '../shared/shared.module';
import { MarkdownModule } from 'ngx-markdown';
import { ProfileComponent } from './profile/profile.component';
import { ProfileEditComponent } from './profile-edit/profile-edit.component';
import { ProfilePostsComponent } from './profile-posts/profile-posts.component';
import { ProfileCommentsComponent } from './profile-comments/profile-comments.component';



@NgModule({
  declarations: [
    ProfileComponent,
    ProfileEditComponent,
    ProfilePostsComponent,
    ProfileCommentsComponent,
  ],
  imports: [
    CommonModule,
    UsersRoutingModule,
    SharedModule,
    MarkdownModule.forChild(),
  ]
})
export class UsersModule { }
