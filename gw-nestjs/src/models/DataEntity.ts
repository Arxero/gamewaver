import {
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';

export interface IDataEntity {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class DataEntity implements IDataEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;

  @BeforeInsert()
  setCreatedAt() {
    this.createdAt = new Date(Date.now());
    this.updatedAt = new Date(Date.now());
  }

  @BeforeUpdate()
  setUpdatedAt() {
    this.updatedAt = new Date(Date.now());
  }
}
