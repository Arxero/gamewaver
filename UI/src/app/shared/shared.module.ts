import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './material-module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from './header/header.component';
import { RouterModule } from '@angular/router';
import { NotFoundComponent } from './not-found/not-found.component';
import { MenuComponent } from './menu/menu.component';
import { TimeAgoPipe } from '../pipes/time-ago.pipe';

@NgModule({
  declarations: [
    HeaderComponent,
    NotFoundComponent,
    MenuComponent,
    TimeAgoPipe,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
  ],

  exports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    HeaderComponent,
    MenuComponent,
    TimeAgoPipe
  ],

})
export class SharedModule {}
