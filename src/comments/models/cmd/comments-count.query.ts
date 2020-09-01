import { IsArray, IsString } from "class-validator";
import { Type } from "@nestjs/common";
import { Transform } from 'class-transformer';


export class CommentsCountQuery {
  @IsArray()
  @IsString({ each: true })
  @Transform((value: string) => value.split(','))
  postIds: string[];
}