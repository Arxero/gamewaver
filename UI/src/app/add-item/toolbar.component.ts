import { Component, HostBinding } from '@angular/core';
import { ToolbarButtonType } from './models';

@Component({
  selector: 'gw-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent {
  @HostBinding('class') className = 'toolbar';

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

  primaryButtons = Object.keys(this.toolbarButtons).slice(0, 9);
  secondaryButtons = Object.keys(this.toolbarButtons).slice(9);
}
