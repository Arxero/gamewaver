import { BaseService } from './../common/shared/base.service';
import {
  Injectable,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
  UnauthorizedException,
  Inject,
  ForbiddenException,
  Scope,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { User, UserRole } from './models/user.entity';
import * as bcrypt from 'bcrypt';
import { ChangePasswordCmd } from 'src/auth/models/cmd/change-password.cmd';
import { ResponseError } from 'src/common/models/response';
import { PagedData } from 'src/common/models/paged-data';
import { GetUserDto } from './models/dto/get-user.dto';
import { QueryRequest } from 'src/common/models/query-request';
import { REQUEST, ContextIdFactory, ModuleRef } from '@nestjs/core';
import { Request } from 'express';
import { TokenUserPayloadDto } from 'src/auth/models/dto/token-user-payload.dto';
import { UpdateUserCmd } from './models/cmd/update-user.cmd';

@Injectable()
export class UsersService extends BaseService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    @Inject(REQUEST) private request: Request,
  ) {
    super();
  }

  private hashRounds = 12;

  async create(payload: User): Promise<User> {
    payload.password = await bcrypt.hash(payload.password, this.hashRounds);
    try {
      return await this.usersRepository.save(payload);
    } catch (error) {
      throw new BadRequestException(error.toString());
    }
  }

  async findAll(queryRequest: QueryRequest): Promise<PagedData<GetUserDto>> {
    const [items, total] = await this.usersRepository.findAndCount({
      order: queryRequest.sorting.order,
      where: queryRequest.filter,
      skip: queryRequest.paging.skip,
      take: queryRequest.paging.take,
    });

    return new PagedData<GetUserDto>(
      items.map(x => new GetUserDto(x)),
      total,
    );
  }

  async findOne(params: DeepPartial<User>): Promise<User> {
    let user: User;
    try {
      user = await this.usersRepository.findOne(params);
    } catch (error) {
      throw new InternalServerErrorException(error.toString());
    }
    if (!user)
      throw new NotFoundException(
        new ResponseError({ message: 'User Not Found' }),
      );
    return user;
  }

  async update(id: string, payload: UpdateUserCmd) {
    const user = await this.findOne({ id });
    this.authorize(user.id, this.request);

    user.email = payload.email;
    user.avatar = payload.avatar;
    user.summary = payload.summary;
    user.location = payload.location;
    user.gender = payload.gender;
    try {
      return await this.usersRepository.save(user);
    } catch (error) {
      throw new InternalServerErrorException(error.toString());
    }
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
      throw new InternalServerErrorException(
        `An error occured during password comparison: ${error.toString()}`,
      );
    }
    if (!isPasswordValid)
      throw new UnauthorizedException(
        `Invalid password for user ${user.username} (${user.email}).`,
      );
    if (!cmd.newPassword)
      throw new BadRequestException(`Invalid value for new password.`);

    try {
      user.password = await bcrypt.hash(cmd.newPassword, this.hashRounds);
    } catch (error) {
      throw new InternalServerErrorException(
        `An error occured during password hashing: ${error.toString()}`,
      );
    }

    await this.usersRepository.save(user);
    return Promise.resolve('Success');
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
      throw new InternalServerErrorException(
        `An error occured during password hashing: ${error.toString()}`,
      );
    }

    await this.usersRepository.save(user);
    return Promise.resolve(
      `Password for user ${user.username} has been changed successfully.`,
    );
  }

  async delete(params: DeepPartial<User>): Promise<User> {
    const user = await this.findOne(params);
    this.authorize(user.id, this.request);
    try {
      return await this.usersRepository.remove(user);
    } catch (error) {
      throw new InternalServerErrorException(error.toString());
    }
  }
}
