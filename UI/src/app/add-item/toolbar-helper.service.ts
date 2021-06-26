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
  keyPressed: string;

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

  inlineformat(startSymbol: string, endSymbol?: string): string {
    if (!this.content) {
      return;
    }

    const words = this.content.split(' ');
    let textToFormat = this.selectedText || words[this.caretWordPosition];
    const replType = this.findReplacementType(textToFormat);
    textToFormat = this.performFormat(textToFormat, startSymbol, endSymbol);

    if (replType === ReplacementType.SingleWord) {
      words.splice(this.caretWordPosition, 1, textToFormat);
    } else if (replType === ReplacementType.MultupleWords) {
      return this.replaceAtSelection(textToFormat);
    } else if (replType === ReplacementType.PartialWord) {
      let wordUnerMouse = words[this.caretWordPosition];
      wordUnerMouse = wordUnerMouse.replace(this.selectedText, textToFormat);
      words.splice(this.caretWordPosition, 1, wordUnerMouse);
    }

    return words.join(' ');
  }

  private replaceAtSelection(replacement: string): string {
    return (
      this.content.substring(0, this.selectionStart) +
      replacement +
      this.content.substring(this.selectionEnd + 1)
    );
  }

  private performFormat(input: string, startSymbol: string, endSymbol = ''): string {
    if (!input) {
      return;
    }

    if (input.startsWith(startSymbol) && input.endsWith(endSymbol)) {
      return input.replace(startSymbol, '').replace(endSymbol, '');
    } else {
      return `${startSymbol}${input.trim().trimEnd()}${endSymbol}`;
    }
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

  private findReplacementType(selectedText: string): ReplacementType {
    if (!selectedText) {
      return;
    }

    const splitedText = selectedText.split(' ').filter(x => x !== '');

    if (splitedText.length === 1) {
      const wordUnerMouse = this.content.split(' ')[this.caretWordPosition];
      const diff = this.selectionEnd - this.selectionStart;

      if (diff < wordUnerMouse.length && diff > 0) {
        return ReplacementType.PartialWord;
      }

      return ReplacementType.SingleWord;
    } else if (splitedText.length > 1) {
      return ReplacementType.MultupleWords;
    }
  }
}
