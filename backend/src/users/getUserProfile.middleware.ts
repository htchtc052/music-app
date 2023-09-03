import { Injectable, NestMiddleware, NotFoundException } from '@nestjs/common';

import { NextFunction, Response } from 'express';
import { UsersService } from './users.service';
import RequestWithUserProfile from './requestWithUserProfile.interface';

@Injectable()
export class GetUserProfileMiddleware implements NestMiddleware {
  constructor(private readonly usersService: UsersService) {}

  async use(req: RequestWithUserProfile, res: Response, next: NextFunction) {
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
