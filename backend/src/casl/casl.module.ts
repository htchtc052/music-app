import { Global, Module } from '@nestjs/common';
import { AbilityFactory } from './ability.factory';
import { UsersModule } from '../users/users.module';
import { ReadUserProfilePolicyProvider } from '../users/policies/readUserProfile.provider';

@Global()
@Module({
  imports: [UsersModule],
  providers: [AbilityFactory, ReadUserProfilePolicyProvider],
  exports: [AbilityFactory],
})
export class CaslModule {}
