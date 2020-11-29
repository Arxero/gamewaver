import { PostCategoryViewModel, PostCategory } from './../../home/models/view/post-category';
import * as moment from 'moment';

export enum SortType {
  Fresh = 'Fresh',
  Popular = 'Popular',
  Commented = 'Commented',
}

export interface SidebarItem {
  label: string;
  url: string;
  class?: string;
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

export enum SortUrl {
  Fresh = '/',
  Popular = 'popular',
  Commented = 'commented',
}

export enum SidebarNavigationType {
  Unknown,
  Search,
  Sort,
  Category,
  Archive,
  Logo,
}

export enum SortTime {
  Days1 = '1 Day',
  Days7 = '7 Days',
  Days30 = '30 Days',
  All = 'All',
}
