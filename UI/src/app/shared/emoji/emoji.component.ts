import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { EmojiEvent, EmojiData } from '@ctrl/ngx-emoji-mart/ngx-emoji';

@Component({
  selector: 'app-emoji',
  templateUrl: './emoji.component.html',
  styleUrls: ['./emoji.component.scss']
})
export class EmojiComponent implements OnInit {
  @Output() emoji: EventEmitter<EmojiData> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {}

  addEmoji(ev: EmojiEvent) {
    this.emoji.emit(ev.emoji);
  }
}
