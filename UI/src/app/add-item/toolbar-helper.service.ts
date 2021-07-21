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
  private splitParam = /[\s]+/g;

  getCaretPos(input: HTMLInputElement): void {
    if (input.selectionStart || input.selectionStart === 0) {
      this.selectionStart = input.selectionStart;
      this.selectionEnd = input.selectionEnd;
      this.caretPosition = input.selectionStart;

      if (this.content) {
        this.selectedText = '';

        if (input.selectionStart != input.selectionEnd) {
          this.selectedText = this.content.substring(input.selectionStart, input.selectionEnd);
          // console.log(this.selectedText);
        }

        // this.setWhiteSpaceBeforeNewLine();
        this.caretWordPosition = this.getWordPosition();
      }
    }
  }

  inlineFormat(startSymbol: string, endSymbol?: string): string {
    if (!this.content) {
      return;
    }

    const words = this.content.split(this.splitParam);
    const newLineIndexes = this.getNewLineIndexes(this.content);
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

    return this.setNewLines(newLineIndexes, words.join(' '));
  }

  newLineFormat(symbol: string): string {
    if (!this.content) {
      return;
    }

    return this.content + symbol;
  }

  private setNewLines(indexes: number[], input: string): string {
    const inputChars = [...input];

    indexes.forEach(i => {
      // if (i >= this.caretWordPosition) {
      //   inputChars.splice(i, 0, '\n');
      // }

      inputChars.splice(i, 0, '\n');
    });

    return inputChars.join('');
  }

  private getNewLineIndexes(input: string): number[] {
    const indexes = [];
    const regex = RegExp('\n', 'g');
    let regexArr: RegExpExecArray;

    while ((regexArr = regex.exec(input)) !== null) {
      indexes.push(regexArr.index);
    }

    return indexes;
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

    const newLineRegex = new RegExp(`^[\n]+[${startSymbol[0]}]`);

    if ((input.startsWith(startSymbol) || newLineRegex.test(input)) && input.endsWith(endSymbol)) {
      return input.replace(startSymbol, '').replace(endSymbol, '');
    }

    if (input.startsWith('\n')) {
      const newLineIndexes = this.getNewLineIndexes(input);
      const inputChars = [...input];
      inputChars.splice(newLineIndexes.length, 0, startSymbol);

      return `${inputChars.join('')}${endSymbol}`;
    }

    return `${startSymbol}${input.trim().trimEnd()}${endSymbol}`;
  }

  private getWordPosition(): number {
    if (!this.content) {
      return;
    }

    const words = this.content.split(this.splitParam);
    let charsLength = 0;

    for (let i = 0; i < words.length; i++) {
      const current = words[i];
      charsLength += current.length;

      if (charsLength + (i + 1) >= this.caretPosition) {
        return i;
      }
    }
  }

  private findReplacementType(selectedText: string): ReplacementType {
    if (!selectedText) {
      return;
    }

    const splitedText = selectedText.split(this.splitParam).filter(x => x !== '');

    if (splitedText.length === 1) {
      const wordUnerMouse = this.content.split(this.splitParam)[this.caretWordPosition];
      const diff = this.selectionEnd - this.selectionStart;

      if (diff < wordUnerMouse.length && diff > 0) {
        return ReplacementType.PartialWord;
      }

      return ReplacementType.SingleWord;
    } else if (splitedText.length > 1) {
      return ReplacementType.MultupleWords;
    }
  }

  private setWhiteSpaceBeforeNewLine(): void {
    const regex = /(?! ).[\n]/g;
    const matches = this.content.match(regex);

    if (!matches) {
      return;
    }

    matches.forEach(m => {
      const chars = m.split('');
      chars.splice(1, 0, ' ');
      this.content = this.content.replace(m, chars.join(''));
    });
  }
}
