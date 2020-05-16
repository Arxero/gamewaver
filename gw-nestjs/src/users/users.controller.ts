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
  SetMetadata,
  Request
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from './models/user.entity';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UpdateUserCmd } from './models/cmd/update-user.cmd';
import { IResponseBase, ResponseSuccess } from 'src/common/models/response';
import { GetUserDto } from './models/dto/get-user.dto';
import { PagedData } from 'src/common/models/paged-data';
import { QueryRequest, QueryParams } from 'src/common/models/query-request';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  async findAll(@Query() queryParams: QueryParams): Promise<IResponseBase> {
    const queryRequest = new QueryRequest(queryParams);
    const result = await this.usersService.findAll(queryRequest);
    return new ResponseSuccess<PagedData<GetUserDto>>({ result });
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<IResponseBase> {
    const result = new GetUserDto(await this.usersService.findOne({ id }));
    return new ResponseSuccess<GetUserDto>({ result });
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @Roles('admin')
  async update(
    @Param('id') id: string,
    @Body() updateModel: UpdateUserCmd,
    @Request() req,
  ): Promise<IResponseBase> {
    const user = await this.usersService.update(id, new User(updateModel), req);
    return new ResponseSuccess<GetUserDto>({ result: new GetUserDto(user) });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  @Roles('admin')
  async delete(
    @Param('id') id: string,
    @Request() req,
  ): Promise<IResponseBase> {
    const user = await this.usersService.delete({ id }, req);
    return new ResponseSuccess<GetUserDto>({ result: new GetUserDto(user) });
  }
}
