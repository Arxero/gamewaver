import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { NotFoundComponent } from './not-found.component';
import { aboutRoute } from './about/about.routing';
import { authRoute } from './auth/auth.routing';
import { usersRoute } from './users/users.routing';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./home/home.module').then(m => m.HomeModule),
  },
  {
    path: aboutRoute,
    loadChildren: () => import('./about/about.module').then(m => m.AboutModule),
  },
  {
    path: authRoute,
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule),
  },
  {
    path: usersRoute,
    loadChildren: () => import('./users/users.module').then(m => m.UsersModule),
  },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled', relativeLinkResolution: 'legacy' }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
