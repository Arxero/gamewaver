import { Component, HostBinding, Output, EventEmitter } from '@angular/core';
import { ToolbarButtonType } from './models';
import { ToolbarHelperService } from './toolbar-helper.service';
import { getKeys } from '@gamewaver/shared';

@Component({
  selector: 'gw-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent {
  @HostBinding('class') className = 'toolbar';
  @Output() textFormatted: EventEmitter<string> = new EventEmitter();

  toolbarButtons: Record<ToolbarButtonType, string> = {
    [ToolbarButtonType.Header]: 'Add title',
    [ToolbarButtonType.Bold]: 'Add bold text',
    [ToolbarButtonType.Italic]: 'Add italic text',
    [ToolbarButtonType.Underline]: 'Add underlined text',
    [ToolbarButtonType.Quote]: 'Insert quote',
    [ToolbarButtonType.InsertLink]: 'Add a link',
    [ToolbarButtonType.List]: 'Add a bulleted list',
    [ToolbarButtonType.Image]: 'Add image',
    [ToolbarButtonType.Video]: 'Add video',

    [ToolbarButtonType.Strikethrough]: 'Add a strikethrough text',
    [ToolbarButtonType.Code]: 'Insert code',
    [ToolbarButtonType.OrderedList]: 'Add a numbered list',
    [ToolbarButtonType.Table]: 'Add a table',
    [ToolbarButtonType.Checkbox]: 'Add a checkbox',
  };

  primaryButtons = getKeys(this.toolbarButtons).slice(0, 9);
  secondaryButtons = getKeys(this.toolbarButtons).slice(9);

  constructor(private toolbarHelperService: ToolbarHelperService) {}

  onBtnClick(btn: ToolbarButtonType): void {
    let formatted: string;

    switch (btn) {
      case ToolbarButtonType.Header:
        formatted = this.toolbarHelperService.inlineformat('# ');
        break;
      case ToolbarButtonType.Bold:
        formatted = this.toolbarHelperService.inlineformat('**', '**');
        break;
      case ToolbarButtonType.Italic:
        formatted = this.toolbarHelperService.inlineformat('*', '*');
        break;
      case ToolbarButtonType.Underline:
        formatted = this.toolbarHelperService.inlineformat('<u>', '</u>');
        break;
      case ToolbarButtonType.Strikethrough:
        formatted = this.toolbarHelperService.inlineformat('~~', '~~');
        break;
      case ToolbarButtonType.Code:
        formatted = this.toolbarHelperService.inlineformat('`', '`');
        break;
      case ToolbarButtonType.Quote:
        formatted = this.toolbarHelperService.inlineformat('\n\n> ');
        break;

      default:
        formatted = this.toolbarHelperService.content;
        break;
    }

    this.textFormatted.emit(formatted);
  }
}
