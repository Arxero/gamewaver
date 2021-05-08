import { Component, OnInit, Input, OnChanges, SimpleChanges, HostBinding } from '@angular/core';
import { PostContext } from '../home/models';

export interface UserInfo {
  id: string;
  avatar: string;

  username?: string;
  role?: string;
  link?: string[];
}

@Component({
  selector: 'gw-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss'],
})
export class UserInfoComponent implements OnChanges {
  @Input() userInfo: UserInfo;
  @Input() showAvatarFallback = true;
  @Input() showInfo = true;
  avatar: string;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['userInfo'].currentValue) {
      this.avatar = this.userInfo.avatar;

      if (!this.userInfo.avatar && this.showAvatarFallback) {
        this.avatar = './assets/images/common/no_avatar.jpg';
      }
    }
  }
}
