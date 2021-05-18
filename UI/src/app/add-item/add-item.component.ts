import { FormGroup, FormControl, Validators, FormGroupDirective, AbstractControl } from '@angular/forms';
import { Component, OnInit, Input, Output, EventEmitter, HostListener, ViewChild } from '@angular/core';
import { CommentCmd, PostCmd, PostsService, CommentsService } from '@gamewaver/home';
import { FormattingHelpComponent } from './formatting-help.component';
import { AddItem } from './add-item.models';
import { MatDialog } from '@angular/material/dialog';
import { EmojiData } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { UserInfo, UserInfoContext, postCategories } from '@gamewaver/shared';

@Component({
  selector: 'gw-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.scss'],
})
export class AddItemComponent implements OnInit {
  @ViewChild(FormGroupDirective) formGroupDirective: FormGroupDirective;
  @Output() cancelEditItem: EventEmitter<void> = new EventEmitter();
  itemForm: FormGroup;
  caretPos = 0;
  categories = postCategories;
  showActions: boolean;
  userInfoContext = UserInfoContext;

  private _addItem: AddItem;
  @Input() set addItem(value: AddItem) {
    this._addItem = value;
    this.createItemForm();
  }

  get addItem(): AddItem {
    return this._addItem;
  }

  get userInfo(): UserInfo {
    return {
      id: this.addItem.userId,
      avatar: this.addItem.userAvatar,
    };
  }

  @HostListener('mousedown')
  mousedown(): void {
    this.showActions = true;
  }

  constructor(
    public dialog: MatDialog,
    private commentsService: CommentsService,
    private postsService: PostsService,
  ) {}

  ngOnInit(): void {
    this.createItemForm();
  }

  get content(): AbstractControl {
    return this.itemForm.get('content');
  }
  get category(): AbstractControl {
    return this.itemForm.get('category');
  }

  createItemForm(): void {
    this.itemForm = new FormGroup({
      content: new FormControl(this.addItem.content, [
        Validators.minLength(this.addItem.minLength),
        Validators.maxLength(this.addItem.maxLength),
        Validators.required,
      ]),
      category: new FormControl(this.addItem.category, []),
    });

    if (this.addItem.isPost) {
      this.itemForm.get('category').setValidators([Validators.required]);
    }
  }

  onSubmit(): void {
    const postCmd: PostCmd = {
      content: this.content.value,
      category: this.category.value,
    };

    const commentCmd: CommentCmd = {
      content: this.content.value,
    };

    if (this.addItem.isPost) {
      this.addItem.id ? this.postsService.edit(postCmd, this.addItem.id) : this.postsService.create(postCmd);
    } else {
      this.addItem.id
        ? this.commentsService.edit(commentCmd, this.addItem.id)
        : this.commentsService.create(commentCmd);
    }

    this.formGroupDirective.resetForm();
    this.showActions = false;
  }

  onCancel(): void {
    this.formGroupDirective.resetForm();
    this.showActions = false;
    this.cancelEditItem.emit();
  }

  getErrorMessage(): string {
    if (this.content.errors?.required) {
      return 'Content is required';
    } else if (this.content.errors?.minlength || this.content.errors?.maxlength) {
      return `Content must be between ${this.addItem.minLength} and ${this.addItem.maxLength} characters long`;
    }

    if (this.category.errors?.required) {
      return 'Category is required';
    }
  }

  onFormatHelp(): void {
    this.dialog.open(FormattingHelpComponent);
  }

  onAddedEmoji(emoji: EmojiData): void {
    const temp = ((this.content.value as string) || '').split('');
    temp.splice(this.caretPos, 0, emoji.native);
    this.itemForm.patchValue({
      content: temp.join(''),
    });
  }

  onUpload(imageLink: string): void {
    this.itemForm.patchValue({
      content: this.content.value + `\n![](${imageLink})\n`,
    });
  }

  getCaretPos(oField): void {
    if (oField.selectionStart || oField.selectionStart === 0) {
      this.caretPos = oField.selectionStart;
    }
  }
}
