import { EmojiComponent } from './emoji.component';
import { AddItemComponent } from './add-item.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormattingHelpComponent } from './formatting-help.component';
import { SharedModule } from '../shared/shared.module';
import { MarkdownModule } from 'ngx-markdown';
import { UploadComponent } from './upload.component';

@NgModule({
  declarations: [
    AddItemComponent,
    FormattingHelpComponent,
    UploadComponent,
    EmojiComponent,
  ],
  imports: [CommonModule, SharedModule, MarkdownModule.forChild()],
  exports: [AddItemComponent],
})
export class AddItemModule {}
