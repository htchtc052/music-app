import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  UseInterceptors,
} from '@nestjs/common';
import { Public } from '../auth/decorators/public.decorator';
import { UserEntity } from './entities/user.entity';
import { Track, User } from '@prisma/client';
import { TracksService } from '../tracks/tracks.service';
import { AbilityFactory } from '../casl/ability.factory';
import { UserProfile } from './decorators/userProfile.decorator';
import { IsOwner } from './decorators/isOwner.decorator';

@Controller('users/:id')
export class UsersController {
  constructor(
    private tracksService: TracksService,
    private readonly abilityFactory: AbilityFactory,
  ) {}

  @Public()
  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  async getUserById(@UserProfile() userProfile: User): Promise<UserEntity> {
    return new UserEntity(userProfile);
  }

  @Public()
  @Get('tracks')
  @UseInterceptors(ClassSerializerInterceptor)
  getUserTracks(
    @UserProfile() userProfile: User,
    @IsOwner() isOwner: boolean,
  ): Promise<Track[]> {
    return this.tracksService.getTracksByUser(userProfile, isOwner);
  }
}
