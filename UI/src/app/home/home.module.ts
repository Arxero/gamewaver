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

@NgModule({
  declarations: [
    HomeComponent,
    PostPageComponent,
    PostsComponent,
    AddItemComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    HomeRoutingModule,
    SidebarModule,
    MarkdownModule.forChild(),
  ],
})
export class HomeModule {}
