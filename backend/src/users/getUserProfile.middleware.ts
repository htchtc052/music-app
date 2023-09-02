import { Injectable, NestMiddleware, NotFoundException } from '@nestjs/common';

import { NextFunction, Request, Response } from 'express';
import { UsersService } from './users.service';

@Injectable()
export class GetUserProfileMiddleware implements NestMiddleware {
  constructor(private readonly usersService: UsersService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const id = parseInt(req.params.id);
    if (!id) {
      throw new NotFoundException(`Missing user id`);
    }
    const userProfile = await this.usersService.findById(id);

    if (!userProfile) {
      throw new NotFoundException(`User profile not found by id=${id}`);
    }

    req['userProfile'] = userProfile;
    next();
  }
}
