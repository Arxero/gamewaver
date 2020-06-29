export enum PostCategory {
  IMAGE = 'image',
  VIDEO = 'video',
  BLOG_POST = 'blog_post',
  MEME = 'meme',
  NSFW = 'nsfw',
  OTHER = 'other',
}

export interface PostCategoryViewModel {
  label: string;
  value: PostCategory;
}

export const postCategories: PostCategoryViewModel[] = [
  {
    label: 'Image',
    value: PostCategory.IMAGE,
  },
  {
    label: 'Video',
    value: PostCategory.VIDEO,
  },
  {
    label: 'Blog Post',
    value: PostCategory.BLOG_POST,
  },
  {
    label: 'Meme',
    value: PostCategory.MEME,
  },
  {
    label: 'NSFW',
    value: PostCategory.NSFW,
  },
  {
    label: 'Other',
    value: PostCategory.OTHER,
  },
];

