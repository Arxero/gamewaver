import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './material-module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from './header/header.component';
import { RouterModule } from '@angular/router';
import { NotFoundComponent } from './not-found/not-found.component';
import { MenuComponent } from './menu/menu.component';
import { TimeAgoPipe } from '../pipes/time-ago.pipe';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { PostComponent } from './post/post.component';
import { MarkdownModule } from 'ngx-markdown';
import { CommentComponent } from './comment/comment.component';
import { FormattingHelpComponent } from './formatting-help/formatting-help.component';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { EmojiComponent } from './emoji/emoji.component';
import { UploadComponent } from './upload/upload.component';
import { GotoTopComponent } from './goto-top/goto-top.component';



@NgModule({
  declarations: [
    HeaderComponent,
    NotFoundComponent,
    MenuComponent,
    PostComponent,
    CommentComponent,
    TimeAgoPipe,
    FormattingHelpComponent,
    EmojiComponent,
    UploadComponent,
    GotoTopComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    InfiniteScrollModule,
    MarkdownModule.forChild(),
    PickerModule,
  ],

  exports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    InfiniteScrollModule,
    HeaderComponent,
    MenuComponent,
    PostComponent,
    CommentComponent,
    TimeAgoPipe,
    PickerModule,
    EmojiComponent,
    UploadComponent,
    GotoTopComponent,
  ],

})
export class SharedModule {}
