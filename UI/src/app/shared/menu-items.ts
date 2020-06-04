export interface Menu {
  path: string;
  name: string;
  icon: string;
}



export const MenuItems: Menu[] = [

  // {
  //   path: 'logout',
  //   icon: 'power_settings_new',
  //   name: 'Logout'
  // } as Menu,
  {
    path: '#',
    icon: '',
    name: 'About'
  } as Menu,
  {
    path: 'login',
    icon: 'power_settings_new',
    name: 'Login'
  } as Menu,
];
