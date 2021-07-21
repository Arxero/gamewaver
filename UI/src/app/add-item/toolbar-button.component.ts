import { Component, Input } from '@angular/core';
import { ToolbarButtonType } from './models';

@Component({
  selector: 'gw-toolbar-button',
  templateUrl: './toolbar-button.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarButtonComponent {
  @Input() button: ToolbarButtonType;

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
    [ToolbarButtonType.More]: 'Show more'
  };
}
