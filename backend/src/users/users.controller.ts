import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserEntity } from './dtos/user.entity';
import RequestWithUserProfile from './types/requestWithUserProfile';
import { User } from '@prisma/client';
import { Public } from 'src/auth/decorators/public.decorator';
import { PoliciesGuard } from '../casl/policies.guard';
import { CheckPolicies } from '../casl/policies.decorator';
import { JwtAuthGuard } from '../auth/guards/jwtAuthGuard';
import { ReadUserProfileHandler } from '../casl/policies/readUserProfile.handler';

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
