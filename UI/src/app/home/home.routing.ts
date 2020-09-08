import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';
import { PostPageComponent } from './post-page/post-page.component';
import { PostsComponent } from './posts/posts.component';
import { SortUrl } from './models/view/post-sort';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      { path: '', component: PostsComponent },
      { path: 'post/:id', component: PostPageComponent },
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
