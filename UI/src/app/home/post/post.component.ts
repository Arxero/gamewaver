import { Component, OnInit, Input } from '@angular/core';
import { GetPostDto } from '../models/dto/get-post.dto';
import { PostViewModel } from '../models/view/post-view-model';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
})
export class PostComponent implements OnInit {
  @Input() post: PostViewModel;

  constructor() { }

  ngOnInit(): void {
  }

  onDelete() {

  }

  onReply() {

  }

}
