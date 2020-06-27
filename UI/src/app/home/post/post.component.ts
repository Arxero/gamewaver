import { Component, OnInit, Input } from '@angular/core';
import { GetPostDto } from '../models/dto/get-post.dto';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {
  @Input() post: GetPostDto;

  constructor() { }

  ngOnInit(): void {
  }

}
