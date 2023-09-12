import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RequestWithUserProfile } from '../types/requestsWithUsers.type';
import { Action } from '../../casl/ability.factory';
import { subject } from '@casl/ability';

export const IsOwner = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): boolean => {
    const request = ctx.switchToHttp().getRequest<RequestWithUserProfile>();

    const readAsOwner = request.authUserAbility.can(
      Action.IsOwner,
      subject('User', request.userProfile),
    );

    return readAsOwner;
  },
);
