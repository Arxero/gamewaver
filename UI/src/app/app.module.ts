import { GotoTopComponent } from './goto-top.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, SecurityContext } from '@angular/core';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared/shared.module';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { AuthEffects } from './store/auth/auth.effects';
import { reducers, metaReducers } from './store/app.state';
import { AppRoutingModule } from './app.routing';
import { MarkdownModule } from 'ngx-markdown';
import { HttpClientService } from './services/http-client.service';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from './auth/auth.interceptor';
import { NotFoundComponent } from './not-found.component';
import { UsersService } from './users/users.service';
import { HomeModule } from './home/home.module';
import { AuthModule } from './auth/auth.module';

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

    // NGRX
    StoreModule.forRoot(reducers, {
      metaReducers,
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true,
      },
    }),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production }),
    EffectsModule.forRoot([]),
    StoreRouterConnectingModule.forRoot({ stateKey: 'router' }),
    EffectsModule.forFeature([AuthEffects]),
    HomeModule.forRoot(),
    AuthModule.forRoot(),
  ],
  providers: [
    { provide: 'IHttpClientService', useClass: HttpClientService },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    UsersService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
