import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  Req,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation } from '@nestjs/swagger';
import { RegisterDto } from './dtos/register.dto';
import { AuthResponse } from './dtos/auth.response';
import { LoginDto } from './dtos/login.dto';
import { plainToClass } from 'class-transformer';
import { UserEntity } from '../users/dtos/user.entity';
import { TokensResponse } from './dtos/tokens.response';
import { Public } from './decorators/public.decorator';
import { JwtAuthGuard } from './guards/jwtAuthGuard';

@Controller('auth')
@UseGuards(JwtAuthGuard)
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Create user' })
  @Public()
  @Post('register')
  @UseInterceptors(ClassSerializerInterceptor)
  register(@Body() registerDto: RegisterDto): Promise<AuthResponse> {
    return this.authService.register(registerDto);
  }

  //
  @ApiOperation({ summary: 'Sign in user' })
  @Public()
  @Post('login')
  @UseInterceptors(ClassSerializerInterceptor)
  login(@Body() loginDto: LoginDto): Promise<AuthResponse> {
    return this.authService.login(loginDto);
  }

  @ApiOperation({ summary: 'Refresh token' })
  @Public()
  @Post('refreshTokens')
  refreshTokens(@Req() req: Request): Promise<TokensResponse> {
    const refreshToken: string = req.body['refreshToken'];
    const tokenId: string = req.body['tokenId'];

    return this.authService.refreshTokens(tokenId, refreshToken);
  }

  @ApiOperation({ summary: 'Get user data' })
  //@UseGuards(JwtAuthGuard)
  @Get('me')
  getUser(@Request() req) {
    const user = req.user;

    return plainToClass(UserEntity, user, {
      excludeExtraneousValues: true,
      groups: ['isOwner'],
    });
  }
}
