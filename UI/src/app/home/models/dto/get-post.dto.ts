import { DataEntity } from '../../../shared/models/common';

export interface GetPostDto extends DataEntity {
  content: string;
  title: string;
  isPublished: boolean;
  authorId: string;
}
