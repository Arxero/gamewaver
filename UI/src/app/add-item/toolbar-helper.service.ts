import { Injectable } from '@angular/core';

export interface WordProperties {
  index: number;
  selectedText: string;
  wholeWord: string;
}

export enum ReplacementType {
  SingleWord = 'single_word',
  PartialWord = 'partial_word',
  MultupleWords = 'multiple_words',
}

@Injectable()
export class ToolbarHelperService {
  content: string;
  caretPosition: number;

  private replType: ReplacementType;
  private selectedText = '';
  private caretWordPosition: number;
  private selectionStart: number;
  private selectionEnd: number;

  getCaretPos(input: HTMLInputElement): void {
    if (input.selectionStart || input.selectionStart === 0) {
      this.selectionStart = input.selectionStart;
      this.selectionEnd = input.selectionEnd;
      this.caretPosition = input.selectionStart;

      if (this.content) {
        this.selectedText = '';

        if (input.selectionStart != input.selectionEnd) {
          this.selectedText = this.content.substring(input.selectionStart, input.selectionEnd);
        }

        this.caretWordPosition = this.getWordPosition();
      }
    }
  }

  formatInput(symbol: string): string {
    if (!this.content) {
      return;
    }

    const words = this.content.split(' ');

    if (!this.selectedText) {
      this.selectedText = words[this.caretWordPosition];
    }

    const text = `${symbol}${this.selectedText.trim().trimEnd()}${symbol}`;
    const replType = this.findSelectionReplacementType(this.selectedText);

    if (replType === ReplacementType.SingleWord) {
      words.splice(this.caretWordPosition, 1, text);
    } else if (replType === ReplacementType.MultupleWords) {
      const letters = this.content.split('');
      letters.splice(this.selectionStart, 0, symbol);
      letters.splice(this.selectionEnd + 1, 0, symbol);

      return letters.join('');
    } else if (replType === ReplacementType.PartialWord) {
      let wordUnerMouse = words[this.caretWordPosition];
      wordUnerMouse = wordUnerMouse.replace(this.selectedText, text);
      words.splice(this.caretWordPosition, 1, wordUnerMouse);
    }

    return words.join(' ');
  }

  private getWordPosition(): number {
    if (!this.content) {
      return;
    }

    const words = this.content.split(' ');
    let charsLength = 0;

    for (let i = 0; i < words.length; i++) {
      const current = words[i];
      charsLength = charsLength + current.length;

      if (charsLength + (i + 1) > this.caretPosition) {
        return i;
      }
    }
  }

  private findSelectionReplacementType(selectedText: string): ReplacementType {
    const splitedText = selectedText.split(' ');

    if (splitedText.length === 1) {
      const wordUnerMouse = this.content.split(' ')[this.caretWordPosition];

      if (this.selectionEnd - this.selectionStart < wordUnerMouse.length) {
        return ReplacementType.PartialWord;
      }

      return ReplacementType.SingleWord;
    } else if (splitedText.length > 1) {
      return ReplacementType.MultupleWords;
    }
  }
}
