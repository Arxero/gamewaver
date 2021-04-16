import { PostsService } from './posts.service';
import { CommentsService } from './comments.service';
import { AddItemModule } from './../add-item/add-item.module';
import { CommentComponent } from './comment.component';
import { EmojiComponent } from '../add-item/emoji.component';
import { FormattingHelpComponent } from '../add-item/formatting-help.component';
import { SidebarModule } from './../sidebar/sidebar.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { MarkdownModule } from 'ngx-markdown';
import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home.routing';
import { PostPageComponent } from './post-page.component';
import { PostsComponent } from './posts.component';
import { UploadComponent } from '../add-item/upload.component';
import { PostComponent } from './post.component';

@NgModule({
  declarations: [
    HomeComponent,
    PostPageComponent,
    PostsComponent,
    CommentComponent,
    PostComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    HomeRoutingModule,
    SidebarModule,
    MarkdownModule.forChild(),
    AddItemModule,
  ],
  exports: [CommentComponent, PostComponent],
  providers: [PostsService, CommentsService],
})
export class HomeModule {}
