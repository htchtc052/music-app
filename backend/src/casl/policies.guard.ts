import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Scope,
  Type,
} from '@nestjs/common';
import { AbilityFactory, AppAbility } from './ability.factory';
import { ContextIdFactory, ModuleRef, Reflector } from '@nestjs/core';
import { IPolicyHandler } from './policies-handler.interface';
import { CHECK_POLICIES_KEY } from './policies.decorator';

@Injectable()
export class PoliciesGuard implements CanActivate {
  constructor(
    private abilityFactory: AbilityFactory,
    private reflector: Reflector,
    private moduleRef: ModuleRef,
  ) {}

  async canActivate(ctx: ExecutionContext) {
    const policiesHandlersRef =
      this.reflector.get<Type<IPolicyHandler>[]>(
        CHECK_POLICIES_KEY,
        ctx.getHandler(),
      ) || [];

    if (policiesHandlersRef.length === 0) return true;

    const contextId = ContextIdFactory.create();
    this.moduleRef.registerRequestByContextId(
      ctx.switchToHttp().getRequest(),
      contextId,
    );

    const policyHandlers: IPolicyHandler[] = [];
    for (let i = 0; i < policiesHandlersRef.length; i++) {
      const policyHandlerRef = policiesHandlersRef[i];
      const policyScope = this.moduleRef.introspect(policyHandlerRef).scope;
      let policyHandler: IPolicyHandler;
      if (policyScope === Scope.DEFAULT) {
        policyHandler = this.moduleRef.get(policyHandlerRef, { strict: false });
      } else {
        policyHandler = await this.moduleRef.resolve(
          policyHandlerRef,
          contextId,
          { strict: false },
        );
      }
      policyHandlers.push(policyHandler);
    }

    const request = ctx.switchToHttp().getRequest<Request>();

    const ability: AppAbility = this.abilityFactory.createForUser(
      request['authUser'],
    );

    return policyHandlers.every((handler) => handler.handle(ability));
  }
}
