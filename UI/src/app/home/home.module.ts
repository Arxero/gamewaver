import { ScrollPositionService } from './services/scroll-position.service';
import { PostsService } from './services/posts.service';
import { VotesService } from './services/votes.service';
import { AddItemModule } from './../add-item/add-item.module';
import { CommentComponent } from './comment.component';
import { SidebarModule } from './../sidebar/sidebar.module';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarkdownModule } from 'ngx-markdown';
import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home.routing';
import { PostPageComponent } from './post-page.component';
import { PostsComponent } from './posts.component';
import { PostComponent } from './post.component';
import { CommentsService } from './services/comments.service';
import { PostPageResolver } from './post-page.resolver';
import { SharedModule } from '@gamewaver/shared';

@NgModule({
  declarations: [HomeComponent, PostPageComponent, PostsComponent, CommentComponent, PostComponent],
  imports: [
    CommonModule,
    SharedModule,
    HomeRoutingModule,
    SidebarModule,
    MarkdownModule.forChild(),
    AddItemModule,
  ],
  exports: [CommentComponent, PostComponent],
  providers: [CommentsService, ScrollPositionService, PostPageResolver],
})
export class HomeModule {
  static forRoot(): ModuleWithProviders<HomeModule> {
    return {
      ngModule: HomeModule,
      providers: [PostsService, VotesService],
    };
  }
}
