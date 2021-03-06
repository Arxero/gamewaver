import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegisterComponent } from './register.component';
import { LoginUrlComponent } from './login-url.component';
import { ForgottenPasswordUrlComponent } from './forgotten-password-url.component';
import { registerRoute, loginRoute, forgottenPasswordRoute } from './auth.models';

const routes: Routes = [
  { path: registerRoute, component: RegisterComponent },
  { path: loginRoute, component: LoginUrlComponent },
  { path: forgottenPasswordRoute, component: ForgottenPasswordUrlComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
