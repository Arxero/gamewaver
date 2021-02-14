import { UserRole, IUser } from '../../users/models/user.entity';
import { TokenUserPayloadDto } from '../../auth/models/dto/token-user-payload.dto';
import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { REQUEST } from '@nestjs/core';

export class BaseService {
  protected authorize(authorId: string, request: Request): void {
    const loggedInUser = new TokenUserPayloadDto(request.user as IUser);

    if (loggedInUser.id !== authorId && loggedInUser.role !== UserRole.ADMIN) {
      throw new ForbiddenException();
    }
  }
}
