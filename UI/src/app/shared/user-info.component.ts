import { Component, Input, OnChanges, SimpleChanges, HostBinding } from '@angular/core';

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
})
export class UserInfoComponent implements OnChanges {
  @Input() userInfo: UserInfo;
  @Input() showAvatarFallback = true;
  @Input() contextInput: UserInfoContext;
  avatar: string;
  context = UserInfoContext;

  @HostBinding('class') className = 'user-info';
  @HostBinding(`class.profile`) get profile(): boolean {
    return this.contextInput === this.context.Profile;
  }

  @HostBinding(`class.profile-edit`) get profileEdit(): boolean {
    return this.contextInput === this.context.ProfileEdit;
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
    if (changes.userInfo.currentValue) {
      this.avatar = this.userInfo.avatar;

      if (!this.userInfo.avatar && this.showAvatarFallback) {
        this.avatar = window.location.origin + '/assets/images/common/no_avatar.jpg';
      }
    }
  }
}
