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
  url: string;
}

export const postSorts: PostSortViewModel[] = [
  {
    label: 'Fresh',
    value: PostSort.Fresh,
    description: 'Sort posts by new',
    icon: 'schedule',
    url: '/',
  },
  {
    label: 'Popular',
    value: PostSort.Popular,
    description: 'Sort posts by upvotes',
    icon: 'thumb_up_alt',
    // url: '?sort=upvotes:desc&filters=createdAt!between!2020-09-01,2020-09-07,date',
    url: '?sort=upvotes:desc',
  },
  {
    label: 'Commented',
    value: PostSort.Commented,
    description: 'Sort posts by comments',
    icon: 'question_answer',
    url: '?sort=comments:desc',
  },
];
