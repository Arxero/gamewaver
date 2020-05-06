import { Column, PrimaryGeneratedColumn } from 'typeorm';

export class DataEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;
}
