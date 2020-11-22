import { RouterModule } from '@angular/router';
import { MaterialModule } from './../shared/material-module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './sidebar.component';
import { SearchComponent } from './search/search.component';
import { SortByComponent } from './sort-by/sort-by.component';
import { CategoryComponent } from './category/category.component';
import { ArchiveComponent } from './archive/archive.component';

@NgModule({
  declarations: [SidebarComponent, SearchComponent, SortByComponent, CategoryComponent, ArchiveComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    RouterModule,
    FormsModule,

  ],
  exports: [
    SidebarComponent
  ]
})
export class SidebarModule {}
