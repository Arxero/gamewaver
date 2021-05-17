import { SharedModule } from '@gamewaver/shared';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { SidebarComponent } from './sidebar.component';
import { SearchComponent } from './search.component';
import { SortByComponent } from './sort-by.component';
import { CategoryComponent } from './category.component';
import { ArchiveComponent } from './archive.component';
import { SidebarHelperService } from './sidebar-helper.service';

@NgModule({
  declarations: [SidebarComponent, SearchComponent, SortByComponent, CategoryComponent, ArchiveComponent],
  imports: [RouterModule, SharedModule],
  exports: [SidebarComponent],
  providers: [SidebarHelperService],
})
export class SidebarModule {}
