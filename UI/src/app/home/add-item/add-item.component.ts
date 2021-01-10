import { AddItem } from './../models/view/add-item';
import { User } from './../../users/models/dto/user';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { PostViewModel } from '../models/view/post-view-model';
import { CommentViewModel } from '../models/view/comment-view-model';
import { postCategories, PostCategory } from '../models/view/post-category';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { HomeState } from '../../store/home/home.reducer';
import { CreatePostCmd } from '../models/cmd/create-post.cmd';
import { UpdatePostCmd } from '../models/cmd/update-post.cmd';
import {
  EditPostAction,
  CreatePostAction,
} from '../../store/home/home.actions';
import { CreateCommentCmd } from '../models/cmd/create-comment.cmd';
import { UpdateCommentCmd } from '../models/cmd/update-comment.cmd';
import { EmojiData } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import {
  EditCommentAction,
  CreateCommentAction,
} from '../../store/comments/comments.actions';
import { FormattingHelpComponent } from './../formatting-help/formatting-help.component';

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.scss'],
})
export class AddItemComponent implements OnInit {
  private _addItem: AddItem;
  @Input() set addItem(value: AddItem) {
    this._addItem = value;
    this.createItemForm();
  }

  get addItem(): AddItem {
    return this._addItem;
  }

  @Output() cancelEditItem: EventEmitter<void> = new EventEmitter();
  itemForm: FormGroup;
  caretPos = 0;

  get categories() {
    return postCategories;
  }
  constructor(public dialog: MatDialog, private store: Store<HomeState>) {}

  ngOnInit(): void {
    this.createItemForm();
  }

  get content() {
    return this.itemForm.get('content');
  }
  get category() {
    return this.itemForm.get('category');
  }

  createItemForm() {
    this.itemForm = new FormGroup({
      content: new FormControl(this.addItem.content, [
        Validators.minLength(this.addItem.minLength),
        Validators.maxLength(this.addItem.maxLength),
      ]),
      category: new FormControl(this.addItem.category, []),
    });

    if (this.addItem.isPost) {
      this.itemForm.get('category').setValidators([Validators.required]);
    }
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

    const cmdCreate: CreateCommentCmd = {
      content: this.content.value,
    };

    const cmdUpdate: UpdateCommentCmd = {
      content: this.content.value,
    };

    if (this.addItem.isPost) {
      this.addItem.id
        ? this.store.dispatch(
            new EditPostAction({ cmd: updateCmd, id: this.addItem.id }),
          )
        : this.store.dispatch(new CreatePostAction({ cmd: createCmd }));
    } else {
      this.addItem.id
        ? this.store.dispatch(
            new EditCommentAction({ cmd: cmdUpdate, id: this.addItem.id }),
          )
        : this.store.dispatch(
            new CreateCommentAction({
              cmd: cmdCreate,
              postId: this.addItem.postId,
            }),
          );
    }

    this.itemForm.reset();
  }

  onCancel() {
    this.cancelEditItem.emit();
  }

  onFormatHelp() {
    this.dialog.open(FormattingHelpComponent);
  }

  onAddedEmoji(emoji: EmojiData) {
    const temp = ((this.content.value as string) || '').split('');
    temp.splice(this.caretPos, 0, emoji.native);
    this.itemForm.patchValue({
      content: temp.join(''),
    });
  }

  onUpload(imageLink: string) {
    this.itemForm.patchValue({
      content: this.content.value + `\n![](${imageLink})\n`,
    });
  }

  getCaretPos(oField) {
    if (oField.selectionStart || oField.selectionStart === 0) {
      this.caretPos = oField.selectionStart;
    }
  }
}
