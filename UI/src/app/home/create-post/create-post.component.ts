import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { BaseComponent } from '../../shared/base.component';
import { Store, select } from '@ngrx/store';
import { AuthState } from '../../store/auth/auth.reducer';
import { User } from '../../users/models/dto/user';
import { takeUntil, filter } from 'rxjs/operators';
import { authState } from '../../store/auth/auth.selectors';
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

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CreatePostComponent extends BaseComponent implements OnInit {
  @Input() post: PostViewModel;
  isLoggedIn: boolean;
  user: User;
  postForm: FormGroup;
  get categories() {
    return postCategories;
  }

  constructor(private store: Store<HomeState>) {
    super();

    store
      .pipe(
        takeUntil(this.destroyed$),
        select(authState),
        filter(x => !!x),
      )
      .subscribe(x => {
        this.isLoggedIn = x.isAuthenticated;
        this.user = x.profile;
      });
  }

  ngOnInit(): void {
    this.postForm = new FormGroup({
      content: new FormControl(this.post ? this.post.content : null, [
        Validators.required,
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
}
