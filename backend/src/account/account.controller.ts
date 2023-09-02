import { ApiOperation } from '@nestjs/swagger';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Put,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { EditUserInfoDto } from './editUserInfo.dto';
import { UserEntity } from '../users/user.entity';
import RequestWithAuthUser from '../users/requestWithAuthUser.interface';
import { JwtAuthGuard } from '../auth/jwtAuthGuard';

@Controller('account')
@UseGuards(JwtAuthGuard)
export class AccountController {
  constructor(private usersService: UsersService) {}

  @ApiOperation({ summary: 'Get own user' })
  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  getUser(@Req() request: RequestWithAuthUser) {
    const user = request.authUser;

    return new UserEntity(user);
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
