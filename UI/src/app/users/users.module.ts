import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersRoutingModule } from './users.routing';
import { SharedModule } from '../shared/shared.module';
import { MarkdownModule } from 'ngx-markdown';
import { ProfileComponent } from './profile/profile.component';



@NgModule({
  declarations: [ProfileComponent],
  imports: [
    CommonModule,
    UsersRoutingModule,
    SharedModule,
    MarkdownModule.forChild(),
  ]
})
export class UsersModule { }
