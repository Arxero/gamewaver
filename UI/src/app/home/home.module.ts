import { ScrollPositionService, PostsService, VotesService, CommentsService } from './services';
import { AddItemModule } from '@gamewaver/add-item';
import { CommentComponent } from './comment.component';
import { SidebarModule } from '@gamewaver/sidebar';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarkdownModule } from 'ngx-markdown';
import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home.routing';
import { PostPageComponent } from './post-page.component';
import { PostsComponent } from './posts.component';
import { PostComponent } from './post.component';
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
