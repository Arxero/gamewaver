import {
  Injectable,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { User } from './models/user.entity';
import * as bcrypt from 'bcrypt';
import * as nodemailer from 'nodemailer';
import { ChangePasswordCmd } from 'src/auth/models/cmd/change-password.cmd';
import { UpdateUserCmd } from './models/cmd/update-user.cmd';
import { ResponseError } from 'src/common/models/response';
import { UserQuery } from './models/user.query';
import { PagedData } from 'src/common/models/paged-data';
import { GetUserDto } from './models/user.dtos';
import { QueryRequest } from 'src/common/models/query-request';

@Injectable()
export class UsersService {
  hashRounds = 12;

  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async create(payload: User) {
    payload.password = await bcrypt.hash(payload.password, this.hashRounds);
    try {
      return await this.usersRepository.save(payload);
    } catch (error) {
      throw new BadRequestException(error.toString());
    }
  }

  async findAll(queryRequest?: QueryRequest): Promise<PagedData<GetUserDto>> {
    const query = this.usersRepository.createQueryBuilder('users');
    queryRequest.sorting?.forEach(x =>
      query.addOrderBy(x.propertyName, x.sortDirectionDb),
    );

    queryRequest.filters?.forEach(x => {
      query.where(`${x.fieldName} ${x.searchOperator} :${x.fieldName}`, { [x.fieldName]: x.searchValue});
    });

    const [items, total] = await query
      .skip(queryRequest.paging.skip)
      .take(queryRequest.paging.take)
      .getManyAndCount();

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
      throw new NotFoundException(new ResponseError({ message: 'Not Found' }));
    return user;
  }

  async update(id: string, payload: User) {
    const user = await this.findOne({ id });
    user.email = payload.email;
    user.role = payload.role;
    user.status = payload.status;
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
    try {
      return await this.usersRepository.remove(user);
    } catch (error) {
      throw new InternalServerErrorException(error.toString());
    }
  }
}
