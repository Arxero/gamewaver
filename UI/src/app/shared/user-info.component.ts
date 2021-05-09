import { Component, OnInit, Input, OnChanges, SimpleChanges, HostBinding, ViewEncapsulation } from '@angular/core';
import { PostContext } from '../home/models';

export interface UserInfo {
  id: string;
  avatar: string;

  username?: string;
  role?: string;
  link?: string[];
  joinedAt?: string;
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
  @Input() showInfo = true;
  @HostBinding('class') class = 'user-info';
  @HostBinding('class.profile') @Input() isProfile: boolean;;
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
