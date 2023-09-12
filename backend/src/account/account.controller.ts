import { ApiOperation } from '@nestjs/swagger';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Put,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { EditUserInfoDto } from './dtos/editUserInfo.dto';
import { UserEntity } from '../users/entities/user.entity';
import { RequestWithAuthUser } from '../users/types/requestsWithUsers.type';

@Controller('account')
export class AccountController {
  constructor(private usersService: UsersService) {}

  @ApiOperation({ summary: 'Get own user' })
  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  async getUser(@Req() request: RequestWithAuthUser) {
    return new UserEntity(request.authUser);
  }

  @ApiOperation({ summary: 'Get own user' })
  @Put('editInfo')
  @UseInterceptors(ClassSerializerInterceptor)
  async editInfo(
    @Body() editUserInfoDto: EditUserInfoDto,
    @Req() request: RequestWithAuthUser,
  ) {
    let user = request.authUser;
    user = await this.usersService.editInfo(user, editUserInfoDto);

    return new UserEntity(user);
  }
}
