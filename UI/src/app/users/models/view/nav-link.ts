export interface NavLink {
  label: string;
  link: string;
}

export const navLinks: NavLink[] = [
  {
    label: 'Home',
    link: './',
  },
  {
    label: 'Posts',
    link: 'posts',
  },
  {
    label: 'Comments',
    link: 'comments',
  },
  {
    label: 'Votes',
    link: 'votes',
  },
];
