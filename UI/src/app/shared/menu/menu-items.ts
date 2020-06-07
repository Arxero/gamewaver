import { aboutRoute } from '../../about/about.routing';

export interface Menu {
  path: string;
  name: string;
  icon: string;
  route: string;
  children: Menu[];
}

export const MenuItems: Menu[] = [
  {
    name: 'about',
    route: aboutRoute,
    children: [
      { path: 'faq', name: 'faq' },
      { path: 'team', name: 'team' },
      { path: 'tos', name: 'tos' },
    ],
  } as Menu,
];
