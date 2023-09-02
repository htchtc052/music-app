import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';

import { User } from '@prisma/client';
import { PoliciesGuard } from '../casl/policies.guard';
import { CheckPolicies } from '../casl/policies.decorator';
import { ReadUserProfileHandler } from '../casl/policies/readUserProfile.handler';
import { JwtAuthGuard } from '../auth/jwtAuthGuard';
import { Public } from '../auth/public.decorator';
import { UserEntity } from './user.entity';
import RequestWithUserProfile from './requestWithUserProfile.interface';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Public()
  @Get(':id')
  @UseGuards(PoliciesGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @CheckPolicies(ReadUserProfileHandler)
  async getUserById(
    @Req() request: RequestWithUserProfile,
  ): Promise<UserEntity> {
    const userProfile: User = request.userProfile;

    //console.debug(userProfile);

    return new UserEntity(userProfile);
  }
}
