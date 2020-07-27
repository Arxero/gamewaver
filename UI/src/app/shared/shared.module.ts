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

@NgModule({
  declarations: [
    HeaderComponent,
    NotFoundComponent,
    MenuComponent,
    PostComponent,
    CommentComponent,
    TimeAgoPipe,
    FormattingHelpComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    InfiniteScrollModule,
    MarkdownModule.forChild(),
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
    TimeAgoPipe
  ],

})
export class SharedModule {}
