import { Component } from '@angular/core';

export interface FormatHelpItem {
  syntax: string;
  example: string;
}

@Component({
  selector: 'gw-formatting-help',
  templateUrl: './formatting-help.component.html',
  styleUrls: ['./formatting-help.component.scss'],
})
export class FormattingHelpComponent {
  displayedColumns: string[] = ['syntax', 'example'];
  dataSource: FormatHelpItem[] = [
    { syntax: '# Header text', example: '# Header text' },
    { syntax: '**Bold text**', example: '**Bold text**' },
    { syntax: '*Italic text*', example: '*Italic text*' },
    { syntax: '~~Strikethrough text~~', example: '~~Strikethrough text~~' },
    {
      syntax:
        '![](https://github.com/adam-p/markdown-here/raw/master/src/common/images/icon48.png "Image Formatting")',
      example:
        '![](https://github.com/adam-p/markdown-here/raw/master/src/common/images/icon48.png "Image Formatting")',
    },

    {
      syntax: `[![](https://github.com/adam-p/markdown-here/raw/master/src/common/images/icon48.png "Image with link")](http://google.com)`,
      example: `[![](https://github.com/adam-p/markdown-here/raw/master/src/common/images/icon48.png "Image with link")]
      (http://google.com)`,
    },
    {
      syntax: 'Inline `code` has `back-ticks around` it.',
      example: 'Inline `code` has `back-ticks around` it.',
    },
    { syntax: '> Blockquotes text', example: '> Blockquotes text' },
    { syntax: '* List item', example: '* List item' },
    {
      syntax: '[Website link](https://google.com)',
      example: '[Website link](https://google.com)',
    },
    {
      syntax: '<audio src="http://stream.zenolive.com/ndcpxfu5vrquv" controls></audio>',
      example: '<audio src="http://stream.zenolive.com/ndcpxfu5vrquv" controls></audio>',
    },
    {
      syntax:
        '<video src="https://cdn.discordapp.com/attachments/672533942569795617/737442164157579344/1595655741600.webm" controls></video>',
      example:
        '<video src="https://cdn.discordapp.com/attachments/672533942569795617/737442164157579344/1595655741600.webm" controls></video>',
    },
    {
      syntax: `<div class="embed-container"><iframe  src="https://www.youtube.com/embed/dQw4w9WgXcQ" frameborder="0" allowfullscreen></iframe></div>`,
      example: `<iframe width="560" height="315" src="https://www.youtube.com/embed/dQw4w9WgXcQ" frameborder="0" allowfullscreen></iframe>`,
    },
  ];
}
