import { Body, Controller, Get } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { RegisterDto } from '../auth/dtos/register.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiOperation({ summary: 'Get user profile by id' })
  @Get(':id')
  register(@Body() registerDto: RegisterDto): Promise<string> {
    return Promise.resolve('test');
  }
}
