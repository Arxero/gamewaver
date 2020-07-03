import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';
import { PostPageComponent } from './post-page/post-page.component';


const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'post/:id', component: PostPageComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
