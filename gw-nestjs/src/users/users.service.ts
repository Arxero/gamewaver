import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { UserCreateDto, UserUpdateDto } from './models/user.dtos';
import { User } from './models/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async create(model: User) {
    model.password = await bcrypt.hash(model.password, 10);
    try {
      return await this.usersRepository.save(model);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async findAll(): Promise<User[]> {
    return await this.usersRepository.find();
  }

  async findOne(params: DeepPartial<User>): Promise<User> {
    return await this.usersRepository.findOne(params);
  }

  async update(id: string, model: UserUpdateDto) {
    const user = await this.usersRepository.findOne(id);
    user.email = model.email;
    return await this.usersRepository.save(user);
  }

  async delete(params: DeepPartial<User>): Promise<User> {
    const user = await this.usersRepository.findOne(params);
    try {
      return await this.usersRepository.remove(user);
    } catch (error) {
      throw new NotFoundException(`User with ${params.toString()} not found.`);
    }
  }
}
