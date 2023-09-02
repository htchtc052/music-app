import { Global, Module } from '@nestjs/common';
import { AbilityFactory } from './ability.factory';
import { UsersModule } from '../users/users.module';
import { ReadUserProfileHandler } from './policies/readUserProfile.handler';
import { ReadUserProfileProvider } from './policies/readUserProfile.provider';

@Global()
@Module({
  imports: [UsersModule],
  providers: [AbilityFactory, ReadUserProfileProvider],
  exports: [AbilityFactory, ReadUserProfileHandler],
})
export class CaslModule {}
