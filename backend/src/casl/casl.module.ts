import { Global, Module } from '@nestjs/common';
import { AbilityFactory } from './ability.factory';
import { UsersModule } from '../users/users.module';
import { ReadTrackHandler } from './policies/readTrack.handler';
import { ReadTrackProvider } from './policies/readTrack.provider';
import { TracksModule } from '../tracks/tracks.module';

@Global()
@Module({
  imports: [UsersModule, TracksModule],
  providers: [AbilityFactory, ReadTrackProvider],
  exports: [AbilityFactory, ReadTrackHandler],
})
export class CaslModule {}
