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
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from './models/user.entity';
import { UserQuery } from './models/user.query';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UpdateUserCmd } from './models/cmd/update-user.cmd';
import { IResponse, ResponseSuccess } from 'src/common/models/dto/response.dto';
import { GetUserDto } from './models/user.dtos';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  async findAll(@Query() query: UserQuery): Promise<IResponse> {
    const users = (await this.usersService.findAll()).map(
      x => new GetUserDto(x),
    );
    return new ResponseSuccess(users);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<IResponse> {
    const user = new GetUserDto(await this.usersService.findOne({ id }));
    return new ResponseSuccess(user);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateModel: UpdateUserCmd,
  ): Promise<IResponse> {
    const user = await this.usersService.update(id, new User(updateModel));
    return new ResponseSuccess(new GetUserDto(user));
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<IResponse> {
    const user = await this.usersService.delete({ id });
    return new ResponseSuccess(new GetUserDto(user));
  }
}
