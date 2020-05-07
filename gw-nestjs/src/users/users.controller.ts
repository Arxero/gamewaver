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
import { User, UserCreateDto, UserQuery, UserUpdateDto } from './models';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';


@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  create(@Body() createModel: UserCreateDto): Promise<User> {
    return this.usersService.create(createModel);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Query() query: UserQuery): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<User> {
    return this.usersService.findOne(id);
  }

  @Get('username/:username')
  findOneByUsername(@Param('username') username: string): Promise<User> {
    return this.usersService.findOneByUsername(username);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateModel: UserUpdateDto): Promise<User> {
    return this.usersService.update(id, updateModel);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<User>  {
    return this.usersService.delete(id);
  }
}
