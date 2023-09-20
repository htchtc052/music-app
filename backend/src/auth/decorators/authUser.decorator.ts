import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '@prisma/client';
import { RequestWithAuthUser } from '../../users/types/requestsWithUsers.type';

export const AuthUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): User => {
    const request = ctx.switchToHttp().getRequest<RequestWithAuthUser>();
    return request.authUser;
  },
);
