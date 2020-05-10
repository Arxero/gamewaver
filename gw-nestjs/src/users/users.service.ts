import { Injectable, BadRequestException, NotFoundException, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { UserCreateDto, UserUpdateDto } from './models/user.dtos';
import { User } from './models/user.entity';
import * as bcrypt from 'bcrypt';
import * as nodemailer from 'nodemailer';
import { ChangePasswordCmd } from 'src/auth/models/cmd/change-password.cmd';

@Injectable()
export class UsersService {
  hashRounds = 12;

  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async create(model: User) {
    model.password = await bcrypt.hash(model.password, this.hashRounds);
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

  async updatePassword(cmd: ChangePasswordCmd): Promise<string> {
    let user: User;
    try {
      user = await this.usersRepository.findOne({ email: cmd.email });
    } catch (error) {
      throw new NotFoundException(`No user was found for email: ${cmd.email}.`);
    }

    let isPasswordValid: boolean;
    try {
      isPasswordValid = await bcrypt.compare(cmd.oldPassword, user.password);
    } catch (error) {
      throw new InternalServerErrorException(`An error occured during password comparison: ${error.toString()}`);
    }
    if (!isPasswordValid) throw new UnauthorizedException(`Invalid password for user ${user.username} (${user.email}).`);
    if (!cmd.newPassword) throw new BadRequestException(`Invalid value for new password.`);

    try {
      user.password = await bcrypt.hash(cmd.newPassword, this.hashRounds);
    } catch (error) {
      throw new InternalServerErrorException(`An error occured during password hashing: ${error.toString()}`);
    }   

    await this.usersRepository.save(user);
    return new Promise(res => res('Success'));
  }

  async resetPassword(id: string, password: string): Promise<string> {
    let user: User;
    try {
      user = await this.usersRepository.findOne(id);
    } catch (error) {
      throw new NotFoundException(`No user was found.`);
    }

    try {
      user.password = await bcrypt.hash(password, this.hashRounds);
    } catch (error) {
      throw new InternalServerErrorException(`An error occured during password hashing: ${error.toString()}`);
    }   

    await this.usersRepository.save(user);
    return new Promise(res => res(`Password for user ${user.username} has been changed successfully.`));
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
