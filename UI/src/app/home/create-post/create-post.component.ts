import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { User } from '../../users/models/dto/user';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { postCategories } from '../models/view/post-category';
import { CreatePostCmd } from '../models/cmd/create-post.cmd';
import { HomeState } from '../../store/home/home.reducer';
import {
  CreatePostAction,
  EditPostAction,
} from '../../store/home/home.actions';
import { PostViewModel } from '../models/view/post-view-model';
import { UpdatePostCmd } from '../models/cmd/update-post.cmd';
import { MatDialog } from '@angular/material/dialog';
import { FormattingHelpComponent } from '../../shared/formatting-help/formatting-help.component';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CreatePostComponent implements OnInit {
  @Input() post: PostViewModel;
  @Input() user: User;
  @Output() cancelEditPost: EventEmitter<void> = new EventEmitter();
  isAddEmoji: boolean;

  postForm: FormGroup;
  get categories() {
    return postCategories;
  }

  constructor(public dialog: MatDialog, private store: Store<HomeState>) {}

  ngOnInit(): void {
    this.postForm = new FormGroup({
      content: new FormControl(this.post ? this.post.content : null, [
        Validators.minLength(3),
        Validators.maxLength(5000),
      ]),
      category: new FormControl(this.post ? this.post.categoryEnum : null, [
        Validators.required,
      ]),
    });
  }

  get content() {
    return this.postForm.get('content');
  }
  get category() {
    return this.postForm.get('category');
  }

  onSubmit() {
    const createCmd: CreatePostCmd = {
      content: this.content.value,
      category: this.category.value,
    };
    const updateCmd: UpdatePostCmd = {
      content: this.content.value,
      category: this.category.value,
    };

    this.post
      ? this.store.dispatch(
          new EditPostAction({ cmd: updateCmd, id: this.post.id }),
        )
      : this.store.dispatch(new CreatePostAction({ cmd: createCmd }));

    this.postForm.reset();
  }

  onCancel() {
    this.cancelEditPost.emit();
  }

  onFormatHelp() {
    this.dialog.open(FormattingHelpComponent);
  }

  onAddEmoji() {
    this.isAddEmoji = !this.isAddEmoji;
  }
}
