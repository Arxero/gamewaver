import { Component, HostBinding } from '@angular/core';
import { ToolbarButton } from './models';

@Component({
  selector: 'gw-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent {
  @HostBinding('class') className = 'toolbar';
  toolbarButtons = Object.values(ToolbarButton);
}
