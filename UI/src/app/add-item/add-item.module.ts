import { EmojiComponent } from './emoji.component';
import { AddItemComponent } from './add-item.component';
import { NgModule } from '@angular/core';
import { FormattingHelpComponent } from './formatting-help.component';
import { SharedModule } from '@gamewaver/shared';
import { MarkdownModule } from 'ngx-markdown';
import { UploadComponent } from './upload.component';
import { ToolbarComponent } from './toolbar.component';
import { ToolbarHelperService } from './toolbar-helper.service';

@NgModule({
  declarations: [
    AddItemComponent,
    FormattingHelpComponent,
    UploadComponent,
    EmojiComponent,
    ToolbarComponent,
  ],
  imports: [SharedModule, MarkdownModule.forChild()],
  exports: [AddItemComponent],
  providers: [ToolbarHelperService],
})
export class AddItemModule {}
