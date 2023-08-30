import { SetMetadata, Type } from '@nestjs/common';
import { IPolicyHandler } from './policies-handler.interface';

export const CHECK_POLICIES_KEY = 'check_policy';
export const CheckPolicies = (...handlers: Type<IPolicyHandler>[]) =>
  SetMetadata(CHECK_POLICIES_KEY, handlers);
