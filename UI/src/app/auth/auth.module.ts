import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { SharedModule } from '../shared/shared.module';
import { AuthRoutingModule } from './auth.routing';
import { MarkdownModule } from 'ngx-markdown';
import { LoginUrlComponent } from './login/login-url.component';
import { RegisterConfirmDialogComponent } from './register/register-confirm-dialog';



@NgModule({
  declarations: [
    LoginComponent,
    LoginUrlComponent,
    RegisterComponent,
    RegisterConfirmDialogComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    AuthRoutingModule,
    MarkdownModule.forChild(),
  ]
})
export class AuthModule { }
