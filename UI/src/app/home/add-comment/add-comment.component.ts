import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { User } from '../../users/models/dto/user';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { HomeState } from '../../store/home/home.reducer';
import { CreateCommentCmd } from '../models/cmd/create-comment.cmd';
import { CreateCommentAction } from '../../store/home/home.actions';

@Component({
  selector: 'app-add-comment',
  templateUrl: './add-comment.component.html',
  styleUrls: ['./add-comment.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AddCommentComponent implements OnInit {
  @Input() user: User;
  @Input() postId: string;
  commentForm: FormGroup;

  constructor(private store: Store<HomeState>) {}

  ngOnInit(): void {
    this.commentForm = new FormGroup({
      content: new FormControl(null, [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(1000),
      ]),
    });
  }

  get content() {
    return this.commentForm.get('content');
  }

  onSubmit() {
    const cmd: CreateCommentCmd = {
      content: this.content.value,
    };

    this.store.dispatch(new CreateCommentAction({ cmd, postId: this.postId }));
    this.commentForm.reset();
  }
}
