import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './material-module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from './header.component';
import { RouterModule } from '@angular/router';
import { MenuComponent } from './menu.component';
import { TimeAgoPipe } from '../pipes/time-ago.pipe';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { MarkdownModule } from 'ngx-markdown';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { RecaptchaModule, RecaptchaFormsModule } from 'ng-recaptcha';
import { UserInfoComponent } from './user-info.component';

@NgModule({
  declarations: [HeaderComponent, MenuComponent, TimeAgoPipe, UserInfoComponent],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    InfiniteScrollModule,
    MarkdownModule.forChild(),
    PickerModule,
    RecaptchaModule,
    RecaptchaFormsModule,
  ],

  exports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    InfiniteScrollModule,
    HeaderComponent,
    MenuComponent,
    TimeAgoPipe,
    PickerModule,
    RecaptchaModule,
    RecaptchaFormsModule,
    UserInfoComponent,
  ],
})
export class SharedModule {}
