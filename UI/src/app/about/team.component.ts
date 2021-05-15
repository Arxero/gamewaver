import { Component } from '@angular/core';

export interface TeamItem {
  image: string;
  name: string;
  role: string;
  link: string;
  description?: string;
}

@Component({
  selector: 'gw-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss']
})
export class TeamComponent {
  teamItems: TeamItem[] = [
    {
      image: 'assets/images/team/Maverick.jpg',
      name: 'Maverick',
      link: 'http://steamcommunity.com/profiles/76561198034795674',
      role: 'Founder',
      description: 'He is a cat.'
    }
  ];
}
