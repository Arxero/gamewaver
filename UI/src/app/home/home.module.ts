import { CommentComponent } from './comment/comment.component';
import { EmojiComponent } from './emoji/emoji.component';
import { FormattingHelpComponent } from './formatting-help/formatting-help.component';
import { SidebarModule } from './../sidebar/sidebar.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { MarkdownModule } from 'ngx-markdown';
import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home.routing';
import { PostPageComponent } from './post-page/post-page.component';
import { PostsComponent } from './posts/posts.component';
import { AddItemComponent } from './add-item/add-item.component';
import { UploadComponent } from './upload/upload.component';
import { PostComponent } from './post/post.component';

@NgModule({
  declarations: [
    HomeComponent,
    PostPageComponent,
    PostsComponent,
    AddItemComponent,
    FormattingHelpComponent,
    UploadComponent,
    EmojiComponent,
    CommentComponent,
    PostComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    HomeRoutingModule,
    SidebarModule,
    MarkdownModule.forChild(),
  ],
  exports: [CommentComponent, PostComponent],
})
export class HomeModule {}
