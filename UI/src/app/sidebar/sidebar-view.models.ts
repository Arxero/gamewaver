import { PostCategoryViewModel, PostCategory } from '@gamewaver/shared';

export enum SortType {
  Fresh = 'Fresh',
  Popular = 'Popular',
  Commented = 'Commented',
}

export interface SidebarItem {
  label: string;
  url: string;
  class?: string;
  fromPost?: boolean;
}

export interface CategorySidebarItem extends SidebarItem {
  category: PostCategoryViewModel;
}

export interface SortSidebarItem extends SidebarItem {
  icon: string;
  description: string;
  sortType: SortType;
}

export interface SidebarSelectedItem {
  sort: SortType;
  time: SortTime;
  category: PostCategory;
  year: string;
  month: string;
}

export enum SidebarNavigation {
  Search = 'search',
  Sort = 'sort',
  Category = 'category',
  Archive = 'archive',
  Logo = 'logo',
  Post = 'post',
}

export enum SortTime {
  Days1 = '1 Day',
  Days7 = '7 Days',
  Days30 = '30 Days',
  All = 'All',
}
