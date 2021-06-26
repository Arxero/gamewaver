import { FormGroup, FormControl, Validators, FormGroupDirective, AbstractControl } from '@angular/forms';
import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  HostListener,
  ViewChild,
  ElementRef,
  OnChanges,
  SimpleChanges,
  AfterViewInit,
} from '@angular/core';
import { CommentCmd, PostCmd, PostsService, CommentsService } from '@gamewaver/home';
import { FormattingHelpComponent } from './formatting-help.component';
import { AddItem } from './add-item.models';
import { MatDialog } from '@angular/material/dialog';
import { EmojiData } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { UserInfo, UserInfoContext, postCategories } from '@gamewaver/shared';
import { TabOption } from './models';
import { trigger, state, style } from '@angular/animations';
import { ToolbarHelperService } from './toolbar-helper.service';

// const mockText = `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`;
const mockText = 'home home home';

@Component({
  selector: 'gw-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.scss'],
  animations: [
    trigger('animateInkBar', [
      state('true', style({ left: '0px' })),
      state('false', style({ left: '100px' })),
    ]),
  ],
})
export class AddItemComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() addItem: AddItem;
  @Output() cancelEditItem: EventEmitter<void> = new EventEmitter();
  @ViewChild(FormGroupDirective) formGroupDirective: FormGroupDirective;
  @ViewChild('textArea') textArea: ElementRef;

  itemForm: FormGroup;
  categories = postCategories;
  showActions: boolean;
  userInfoContext = UserInfoContext;
  tabOption = TabOption;
  activeTab = TabOption.Write;
  showToolbar = true;

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
    private toolbarHelperService: ToolbarHelperService,
  ) {}

  ngOnInit(): void {
    this.createItemForm();
    this.content.valueChanges.subscribe(x => {
      this.toolbarHelperService.content = x;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['addItem'].currentValue) {
      this.createItemForm();
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.itemForm.patchValue({ content: mockText });
    }, 0);

  }

  get content(): AbstractControl {
    return this.itemForm.get('content');
  }

  get category(): AbstractControl {
    return this.itemForm.get('category');
  }

  createItemForm(): void {
    this.itemForm = new FormGroup({
      content: new FormControl(this.addItem.content || '', [
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
    this.textArea.nativeElement.style.height = '36px';
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
    const temp = (this.content.value as string).split('');
    temp.splice(this.toolbarHelperService.caretPosition, 0, emoji.native);
    this.itemForm.patchValue({
      content: temp.join(''),
    });
  }

  onUpload(imageLink: string): void {
    this.itemForm.patchValue({
      content: this.content.value + `\n![](${imageLink})\n`,
    });
  }

  onClickTextArea(input: HTMLInputElement): void {
    this.toolbarHelperService.getCaretPos(input);
  }

  onKeyupEvent(e: KeyboardEvent): void {
    this.toolbarHelperService.keyPressed = e.key;
  }

  onSelectedTab(tab: TabOption): void {
    this.activeTab = tab;
    this.showToolbar = this.activeTab === TabOption.Write;
  }

  onTextFormatted(text: string): void {
    this.itemForm.patchValue({ content: text });
  }
}
