import {
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';

export class DataEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;

  @BeforeInsert()
  setCreatedAt() {
    this.createdAt = new Date(Date.now());
  }

  @BeforeUpdate()
  setUpdatedAt() {
    this.updatedAt = new Date(Date.now());
  }
}
