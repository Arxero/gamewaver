import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { LoginUrlComponent } from './login/login-url.component';

export const authRoute = 'auth';

const routes: Routes = [
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginUrlComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
