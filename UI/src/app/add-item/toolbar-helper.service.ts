import { Injectable } from '@angular/core';

@Injectable()
export class ToolbarHelperService {
  content: string;
  caretPosition = 0;
  selectedText = '';
  private caretWordPosition: number;

  getCaretPos(input: HTMLInputElement): void {
    if (input.selectionStart || input.selectionStart === 0) {
      this.caretPosition = input.selectionStart;

      if (this.content && input.selectionStart != input.selectionEnd) {
        this.selectedText = this.content.substring(input.selectionStart, input.selectionEnd);
      }

      this.getWordPosition();
    }
  }

  private getWordPosition(): void {
    if (!this.content) {
      return;
    }

    const words = this.content.split(' ');
    let charsLength = 0;

    for (let i = 0; i < words.length; i++) {
      const current = words[i];
      charsLength = charsLength + current.length;

      if (charsLength + (i + 1) > this.caretPosition) {
        this.caretWordPosition = i;
        return;
      }
    }
  }
}
