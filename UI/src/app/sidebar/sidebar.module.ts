import { SharedModule } from '@gamewaver/shared';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './sidebar.component';
import { SearchComponent } from './search.component';
import { SortByComponent } from './sort-by.component';
import { CategoryComponent } from './category.component';
import { ArchiveComponent } from './archive.component';
import { SidebarHelperService } from './sidebar-helper.service';

@NgModule({
  declarations: [
    SidebarComponent,
    SearchComponent,
    SortByComponent,
    CategoryComponent,
    ArchiveComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    FormsModule,
    SharedModule
  ],
  exports: [SidebarComponent],
  providers: [SidebarHelperService]
})
export class SidebarModule {}
