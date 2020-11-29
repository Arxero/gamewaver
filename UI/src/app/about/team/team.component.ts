import { Component, OnInit } from '@angular/core';

export interface TeamItem {
  image: string;
  name: string;
  role: string;
  link: string;
  description?: string;
}

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss']
})
export class TeamComponent implements OnInit {
  teamItems: TeamItem[] = [
    {
      image: 'assets/images/team/Maverick.jpg',
      name: 'Maverick',
      link: 'http://steamcommunity.com/profiles/76561198034795674',
      role: 'Founder',
      description: 'He is a cat.'
    },
    // {
    //   image: 'assets/images/team/Xinored.jpg',
    //   name: 'Deronix',
    //   link: 'http://steamcommunity.com/profiles/76561198069703964',
    //   role: 'Co-Founder',
    //   description: 'just a regular everyday normal motherfucker'
    // },
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
