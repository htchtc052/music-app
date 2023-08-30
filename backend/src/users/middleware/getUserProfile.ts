import { Injectable, NestMiddleware, NotFoundException } from '@nestjs/common';
import { UsersService } from '../users.service';
import { NextFunction, Request, Response } from 'express';

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

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    req.userProfile = userProfile;
    next();
  }
}
