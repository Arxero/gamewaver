import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tos',
  templateUrl: './tos.component.html',
  styleUrls: ['./tos.component.scss'],
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
