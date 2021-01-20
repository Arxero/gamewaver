import { PostPageResolver } from './post-page.resolver';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';
import { PostPageComponent } from './post-page.component';
import { PostsComponent } from './posts.component';
const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      { path: '', component: PostsComponent },
      {
        path: `post/:id`,
        component: PostPageComponent,
        resolve: { userData: PostPageResolver }
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
