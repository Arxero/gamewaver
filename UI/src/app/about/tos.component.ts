import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'gw-tos',
  templateUrl: './tos.component.html',
})
export class TosComponent implements OnInit {
  constructor() {}
  markdownString = 'This is text with **markdown**';

  ngOnInit(): void {}

  onLoad() {

  }

  onError(e) {
    console.log(e);
  }
}
