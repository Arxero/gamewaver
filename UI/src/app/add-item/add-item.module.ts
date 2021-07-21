import { EmojiComponent } from './emoji.component';
import { AddItemComponent } from './add-item.component';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormattingHelpComponent } from './formatting-help.component';
import { SharedModule } from '@gamewaver/shared';
import { MarkdownModule } from 'ngx-markdown';
import { UploadComponent } from './upload.component';
import { ToolbarComponent } from './toolbar.component';
import { ToolbarHelperService } from './toolbar-helper.service';
import { ToolbarButtonComponent } from './toolbar-button.component';

@NgModule({
  declarations: [
    AddItemComponent,
    FormattingHelpComponent,
    UploadComponent,
    EmojiComponent,
    ToolbarComponent,
    ToolbarButtonComponent,
  ],
  imports: [SharedModule, MarkdownModule.forChild()],
  exports: [AddItemComponent],
  providers: [ToolbarHelperService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AddItemModule {}
