import { UsersService } from './users.service';
import { HomeModule } from './../home/home.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersRoutingModule } from './users.routing';
import { SharedModule } from '../shared/shared.module';
import { MarkdownModule } from 'ngx-markdown';
import { ProfileComponent } from './profile.component';
import { ProfileEditComponent } from './profile-edit.component';
import { ProfilePostsComponent } from './profile-posts.component';
import { PostsService } from '../home/services/posts.service';

@NgModule({
  declarations: [
    ProfileComponent,
    ProfileEditComponent,
    ProfilePostsComponent,
  ],
  imports: [
    CommonModule,
    UsersRoutingModule,
    SharedModule,
    MarkdownModule.forChild(),
    HomeModule
  ],
  providers: [UsersService, PostsService]
})
export class UsersModule { }
