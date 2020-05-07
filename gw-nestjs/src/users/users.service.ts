import { Injectable } from '@nestjs/common';
import { User, UserCreateDto, UserUpdateDto } from './models';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async create(model: UserCreateDto) {
    const user = new User();
    user.username = model.username;
    user.password = model.password;
    user.email = model.email;
    return await this.usersRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return await this.usersRepository.find();
  }

  async findOne(id: string): Promise<User> {
    return await this.usersRepository.findOne(+id);
  }

  async findOneByUsername(username: string): Promise<User> {
    return await this.usersRepository.findOne({ where: [{ username }] });
  }

  async update(id: string, model: UserUpdateDto) {
    const user = await this.usersRepository.findOne(id);
    user.email = model.email;
    return await this.usersRepository.save(user);
  }

  async delete(id: string): Promise<User> {
    const user = await this.usersRepository.findOne(id);
    return await this.usersRepository.remove(user);
  }
}
