import * as moment from 'moment';

export enum PostSort {
  Unknown,
  Fresh,
  Popular,
  Commented,
}

export interface PostSortViewModel {
  label: string;
  value: PostSort;
  description: string;
  icon: string;
  url: SortUrl;
  iconColor: string;
}

export enum SortUrl {
  Fresh = '/',
  Popular = 'popular',
  Commented = 'commented',
}

export enum SortTime {
  Unknown,
  Days1,
  Days7,
  Days30,
  All,
}

export interface PostSortTime {
  label: string;
  value: SortTime;
}

export const postSortTimes: PostSortTime[] = [
  {
    label: '1 Day',
    value: SortTime.Days1,
  },
  {
    label: '7 Days',
    value: SortTime.Days7,
  },
  {
    label: '30 Days',
    value: SortTime.Days30,
  },
  {
    label: 'All',
    value: SortTime.All,
  },
];

export const postSorts: PostSortViewModel[] = [
  {
    label: 'Fresh',
    value: PostSort.Fresh,
    description: 'Sort posts by new',
    icon: 'schedule',
    url: SortUrl.Fresh,
    iconColor: 'primary',
  },
  {
    label: 'Popular',
    value: PostSort.Popular,
    description: 'Sort posts by upvotes',
    icon: 'thumb_up_alt',
    url: SortUrl.Popular,
    // url: `?sort=upvotes:desc&filters=createdAt!between!2020-09-01,2020-09-07,date`,
    // url: '?sort=upvotes:desc',
    iconColor: '',
  },
  {
    label: 'Commented',
    value: PostSort.Commented,
    description: 'Sort posts by comments',
    icon: 'question_answer',
    // url: `${SortUrl.Commented}?sort=comments:desc`,
    url: SortUrl.Commented,
    iconColor: '',
  },
];

export const dateFilterSort = (
  amount: moment.DurationInputArg1,
  unit: moment.DurationInputArg2,
) =>
  `&filters=createdAt!between!${moment()
    .subtract(amount, unit)
    .format('YYYY-MM-DD')},${moment().format('YYYY-MM-DD')},date`;
