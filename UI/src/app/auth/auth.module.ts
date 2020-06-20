import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { SharedModule } from '../shared/shared.module';
import { AuthRoutingModule } from './auth.routing';
import { MarkdownModule } from 'ngx-markdown';
import { LoginUrlComponent } from './login/login-url.component';
import { RegisterConfirmDialogComponent } from './register/register-confirm-dialog';
import { ForgottenPasswordComponent } from './forgotten-password/forgotten-password.component';
import { ForgottenPasswordUrlComponent } from './forgotten-password/forgotten-password-url.component';
import { ForgottenPasswordNewComponent } from './forgotten-password/forgotten-password-new.component';



@NgModule({
  declarations: [
    LoginComponent,
    LoginUrlComponent,
    RegisterComponent,
    RegisterConfirmDialogComponent,
    ForgottenPasswordComponent,
    ForgottenPasswordNewComponent,
    ForgottenPasswordUrlComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    AuthRoutingModule,
    MarkdownModule.forChild(),
  ]
})
export class AuthModule { }
