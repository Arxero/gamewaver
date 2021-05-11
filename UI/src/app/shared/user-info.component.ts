import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
  HostBinding,
  ViewEncapsulation,
} from '@angular/core';
import { PostContext } from '../home/models';

export interface UserInfo {
  id: string;
  avatar: string;

  username?: string;
  role?: string;
  link?: string[];
  joinedAt?: string;
}

export enum UserInfoContext {
  Profile = 'profile',
  ProfileEdit = 'profile-edit',
  ProfilePost = 'profile-post',
  AddItem = 'add-item',
  Post = 'post',
}

@Component({
  selector: 'gw-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class UserInfoComponent implements OnChanges {
  @Input() userInfo: UserInfo;
  @Input() showAvatarFallback = true;
  @HostBinding('class') class = 'user-info';
  avatar: string;
  context = UserInfoContext;

  @Input() contextInput: UserInfoContext;

  @HostBinding(`class.profile`) get profile() {
    return this.contextInput === this.context.Profile;
  }

  @HostBinding(`class.profile-edit`) get profileEdit() {
    return this.contextInput === this.context.ProfileEdit;
  }

  @HostBinding(`class.profile-post`) get profilePost() {
    return this.contextInput === this.context.ProfilePost;
  }

  @HostBinding(`class.add-item`) get addItem() {
    return this.contextInput === this.context.AddItem;
  }

  @HostBinding(`class.post`) get post() {
    return this.contextInput === this.context.Post;
  }

  get shouldShowAvatarImage(): boolean {
    switch (this.contextInput) {
      case this.context.AddItem:
      case this.context.ProfileEdit:
      case this.context.Profile:
        return true;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['userInfo'].currentValue) {
      this.avatar = this.userInfo.avatar;

      if (!this.userInfo.avatar && this.showAvatarFallback) {
        this.avatar = './assets/images/common/no_avatar.jpg';
      }
    }
  }
}
