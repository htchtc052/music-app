import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  Req,
  Request,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation } from '@nestjs/swagger';
import { RegisterDto } from './dtos/register.dto';
import { AuthResponse } from './responses/auth.response';
import { LoginDto } from './dtos/login.dto';
import { TokensResponse } from './responses/tokens.response';
import { Public } from './decorators/public.decorator';

@Controller('auth')
//@UseGuards(JwtAuthGuard)
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
}
