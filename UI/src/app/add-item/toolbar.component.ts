import { Component, HostBinding, Output, EventEmitter } from '@angular/core';
import { ToolbarButtonType } from './models';
import { ToolbarHelperService } from './toolbar-helper.service';
import '@github/markdown-toolbar-element';

@Component({
  selector: 'gw-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent {
  @HostBinding('class') className = 'toolbar';
  @Output() textFormatted: EventEmitter<string> = new EventEmitter();
  btnType = ToolbarButtonType;

  constructor(private toolbarHelperService: ToolbarHelperService) {}

  onBtnClick(btn: ToolbarButtonType): void {
    let formatted: string;

    switch (btn) {
      case ToolbarButtonType.Underline:
        formatted = this.toolbarHelperService.newLineFormat('\n\n<u>underlined text</u>');
        break;

      case ToolbarButtonType.Table:
        let table = `
| Syntax      | Description |
| ----------- | ----------- |
| Header      | Title       |
| Paragraph   | Text        |`;
        formatted = this.toolbarHelperService.newLineFormat(`\n\n${table}`);
        break;
    }

    this.textFormatted.emit(formatted);
  }
}
