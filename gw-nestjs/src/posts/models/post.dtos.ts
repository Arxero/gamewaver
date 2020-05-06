export class PostCreateDto {
  content: string;
  title: string;
}

export class PostUpdateDto {
  content: string;
  title: string;
  isPublished: boolean;
}
