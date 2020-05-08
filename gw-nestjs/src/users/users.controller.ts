import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Param,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserCreateDto, UserUpdateDto } from './models/user.dtos';
import { User } from './models/user.entity';
import { UserQuery } from './models/user.query';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Query() query: UserQuery): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<User> {
    return this.usersService.findOne({ id });
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateModel: UserUpdateDto,
  ): Promise<User> {
    return this.usersService.update(id, updateModel);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<User> {
    return this.usersService.delete({ id });
  }
}
