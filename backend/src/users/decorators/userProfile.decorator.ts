import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '@prisma/client';
import { RequestWithUserProfile } from '../types/requestsWithUsers.type';

export const UserProfile = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): User => {
    const request = ctx.switchToHttp().getRequest<RequestWithUserProfile>();
    return request.userProfile;
  },
);
