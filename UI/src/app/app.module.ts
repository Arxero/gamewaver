import { SharedModule } from '@gamewaver/shared';
import { GotoTopComponent } from './goto-top.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, SecurityContext } from '@angular/core';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app.routing';
import { MarkdownModule } from 'ngx-markdown';
import { HttpClientService } from '@gamewaver/services';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor, AuthModule } from '@gamewaver/auth';
import { NotFoundComponent } from './not-found.component';
import { HomeModule } from '@gamewaver/home';

@NgModule({
  declarations: [AppComponent, NotFoundComponent, GotoTopComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    SharedModule,
    MarkdownModule.forRoot({
      sanitize: SecurityContext.NONE,
    }),
    HomeModule.forRoot(),
    AuthModule.forRoot(),
  ],
  providers: [
    { provide: 'IHttpClientService', useClass: HttpClientService },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
