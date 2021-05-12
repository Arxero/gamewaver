import { HeaderComponent } from './header.component';
import { MenuComponent } from './menu.component';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login.component';
import { RegisterComponent } from './register.component';
import { AuthRoutingModule } from './auth.routing';
import { MarkdownModule } from 'ngx-markdown';
import { LoginUrlComponent } from './login-url.component';
import { RegisterConfirmDialogComponent } from './register-confirm-dialog';
import { ForgottenPasswordComponent } from './forgotten-password.component';
import { ForgottenPasswordUrlComponent } from './forgotten-password-url.component';
import { ForgottenPasswordNewComponent } from './forgotten-password-new.component';
import { AuthService } from './auth.service';
import { SharedModule } from '@gamewaver/shared';

@NgModule({
  declarations: [
    LoginComponent,
    LoginUrlComponent,
    RegisterComponent,
    RegisterConfirmDialogComponent,
    ForgottenPasswordComponent,
    ForgottenPasswordNewComponent,
    ForgottenPasswordUrlComponent,
    MenuComponent,
    HeaderComponent
  ],
  imports: [CommonModule, SharedModule, AuthRoutingModule, MarkdownModule.forChild()],
  exports: [MenuComponent, HeaderComponent],
})
export class AuthModule {
  static forRoot(): ModuleWithProviders<AuthModule> {
    return {
      ngModule: AuthModule,
      providers: [AuthService],
    };
  }
}
