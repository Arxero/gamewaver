import { Component, OnInit } from '@angular/core';

export interface FormatHelpItem {
  syntax: string;
  example: string;
}

@Component({
  selector: 'app-formatting-help',
  templateUrl: './formatting-help.component.html',
  styleUrls: ['./formatting-help.component.scss'],
})
export class FormattingHelpComponent implements OnInit {
  displayedColumns: string[] = ['syntax', 'example'];
  dataSource: FormatHelpItem[] = [
    { syntax: '# Header text', example: '# Header text' },
    { syntax: '**Bold text**', example: '**Bold text**' },
    { syntax: '*Italic text*', example: '*Italic text*' },
    { syntax: '~~Strikethrough text~~', example: '~~Strikethrough text~~' },
  ];

  constructor() {}

  ngOnInit(): void {}
}
