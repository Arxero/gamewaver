import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './shared/not-found/not-found.component';
import { aboutRoute } from './about/about.routing';
import { authRoute } from './auth/auth.routing';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: aboutRoute,
    loadChildren: () =>
      import('./about/about.module').then(m => m.AboutModule),
  },
  {
    path: authRoute,
    loadChildren: () =>
      import('./auth/auth.module').then(m => m.AuthModule),
  },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
