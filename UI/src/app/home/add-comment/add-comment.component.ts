import {
  Component,
  OnInit,
  Input,
  ViewEncapsulation,
  Output,
  EventEmitter,
} from '@angular/core';
import { User } from '../../users/models/dto/user';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { HomeState } from '../../store/home/home.reducer';
import { CreateCommentCmd } from '../models/cmd/create-comment.cmd';
import {
  CreateCommentAction,
  EditCommentCancelAction,
  EditCommentAction,
} from '../../store/home/home.actions';
import { CommentViewModel } from '../models/view/comment-view-model';
import { UpdateCommentCmd } from '../models/cmd/update-comment.cmd';
import { MatDialog } from '@angular/material/dialog';
import { FormattingHelpComponent } from '../../shared/formatting-help/formatting-help.component';
import { EmojiData } from '@ctrl/ngx-emoji-mart/ngx-emoji';

@Component({
  selector: 'app-add-comment',
  templateUrl: './add-comment.component.html',
  styleUrls: ['./add-comment.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AddCommentComponent implements OnInit {
  @Input() user: User;
  @Input() postId: string;
  private _comment: CommentViewModel;
  @Input() set comment(value: CommentViewModel) {
    this._comment = value;
    if (this.commentForm) {
      this.content.setValue(this._comment ? this._comment.content : null);
    }
  }
  get comment(): CommentViewModel {
    return this._comment;
  }
  @Output() cancelEditComment: EventEmitter<void> = new EventEmitter();
  isAddEmoji: boolean;
  commentForm: FormGroup;
  caretPos = 0;

  constructor(public dialog: MatDialog, private store: Store<HomeState>) {}

  ngOnInit(): void {
    this.commentForm = new FormGroup({
      content: new FormControl(this.comment ? this.comment.content : null, [
        Validators.minLength(3),
        Validators.maxLength(1000),
      ]),
    });
  }

  get content() {
    return this.commentForm.get('content');
  }

  onSubmit() {
    const cmdCreate: CreateCommentCmd = {
      content: this.content.value,
    };

    const cmdUpdate: UpdateCommentCmd = {
      content: this.content.value,
    };

    this.comment
      ? this.store.dispatch(
          new EditCommentAction({ cmd: cmdUpdate, id: this.comment.id }),
        )
      : this.store.dispatch(
          new CreateCommentAction({ cmd: cmdCreate, postId: this.postId }),
        );

    this.commentForm.reset();
  }

  onCancel() {
    this.store.dispatch(new EditCommentCancelAction({ data: this.comment }));
    this.cancelEditComment.emit();
  }

  onFormatHelp() {
    this.dialog.open(FormattingHelpComponent);
  }

  onAddEmoji() {
    this.isAddEmoji = !this.isAddEmoji;
  }

  onAddedEmoji(emoji: EmojiData) {
    this.isAddEmoji = !this.isAddEmoji;
    const temp = (this.content.value as string).split('');
    temp.splice(this.caretPos, 0, emoji.native);
    this.commentForm.patchValue({
      content: temp.join('')
    });
  }

  onUpload(imageLink: string) {
    this.commentForm.patchValue({
      content: this.content.value + `\n![](${imageLink})\n`,
    });
  }

  getCaretPos(oField) {
    if (oField.selectionStart || oField.selectionStart === 0) {
      this.caretPos = oField.selectionStart;
    }
  }
}
