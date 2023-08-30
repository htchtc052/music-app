import { IPolicyHandler } from './policies-handler.interface';
import { AbilityFactory } from './ability.factory';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Type,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CHECK_POLICIES_KEY } from './policies.decorator';

@Injectable()
export class PoliciesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private AbilityFactory: AbilityFactory,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const policiesHandlersRef =
      this.reflector.get<Type<IPolicyHandler>[]>(
        CHECK_POLICIES_KEY,
        context.getHandler(),
      ) || [];

    if (policiesHandlersRef.length === 0) return true;

    const request = context.switchToHttp().getRequest();

    const { user } = request;

    const ability = this.AbilityFactory.createForUser(request.user);

    return policiesHandlersRef.every((handlerRef) => {
      const policyHandler = new handlerRef();
      console.log(`policyHandler` + policyHandler);
      return policyHandler.handle(ability);
    });
  }
}
