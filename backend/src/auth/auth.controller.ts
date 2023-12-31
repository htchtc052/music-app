import { AuthService } from './auth.service';
import { ApiOperation } from '@nestjs/swagger';
import { Public } from './decorators/public.decorator';
import {
  Body,
  ClassSerializerInterceptor,
  Post,
  Req,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { RegisterDto } from './dtos/register.dto';
import { AuthResponse } from './responses/auth.response';
import { JwtAuthGuard } from './guards/jwtAuthGuard';
import { LoginDto } from './dtos/login.dto';
import { TokensResponse } from './responses/tokens.response';

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
