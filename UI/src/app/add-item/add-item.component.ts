import { CommentsService } from './../home/services/comments.service';
import { FormattingHelpComponent } from './formatting-help.component';
import { AddItem } from './add-item.models';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EmojiData } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { CommentCmd, postCategories, PostCmd } from '../home/models';
import { PostsService } from '../home/services/posts.service';

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.scss'],
})
export class AddItemComponent implements OnInit {
  private _addItem: AddItem;
  itemForm: FormGroup;
  caretPos = 0;
  categories = postCategories;
  showActions: boolean;

  @HostListener('mousedown')
  mousedown() {
    this.showActions = true;
  }

  @Output() cancelEditItem: EventEmitter<void> = new EventEmitter();
  @Input() set addItem(value: AddItem) {
    this._addItem = value;
    this.createItemForm();
  }

  get addItem(): AddItem {
    return this._addItem;
  }

  constructor(
    public dialog: MatDialog,
    private commentsService: CommentsService,
    private postsService: PostsService,
  ) {}

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
        Validators.required,
      ]),
      category: new FormControl(this.addItem.category, []),
    });

    if (this.addItem.isPost) {
      this.itemForm.get('category').setValidators([Validators.required]);
    }
  }

  onSubmit() {
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

    this.itemForm.reset();
  }

  onCancel() {
    this.showActions = false;
    this.itemForm.reset();
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
