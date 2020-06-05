import { aboutRoute } from '../../about/about.routing';

export interface Menu {
  path: string;
  name: string;
  icon: string;
  route: string;
  children: Menu[];
}

export const MenuItems: Menu[] = [
  // {
  //   path: 'logout',
  //   icon: 'power_settings_new',
  //   name: 'Logout'
  // } as Menu,
  {
    name: 'about',
    route: aboutRoute,
    children: [
      { path: 'faq', name: 'faq' },
      { path: 'team', name: 'team' },
      { path: 'tos', name: 'tos' },
    ],
  } as Menu,
  {
    path: 'login',
    icon: 'power_settings_new',
    name: 'Login',
  } as Menu,
];
