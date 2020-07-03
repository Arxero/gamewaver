import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { MarkdownModule } from 'ngx-markdown';
import { CreatePostComponent } from './create-post/create-post.component';
import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home.routing';
import { PostComponent } from './post/post.component';
import { PostPageComponent } from './post-page/post-page.component';

@NgModule({
  declarations: [
    HomeComponent,
    CreatePostComponent,
    PostComponent,
    PostPageComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    HomeRoutingModule,
    MarkdownModule.forChild(),
  ],
})
export class HomeModule {}