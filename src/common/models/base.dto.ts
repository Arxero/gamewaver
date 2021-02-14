import { IDataEntity } from "./data-entity";

export class BaseDto implements IDataEntity {
  constructor(data: IDataEntity){
    this.id = data.id;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  id: string;
  createdAt: Date;
  updatedAt: Date;
}