import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'nestjs-prisma';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dtos/register.dto';
import { UsersService } from '../users/users.service';
import * as argon2 from 'argon2';
import {
  JwtAccessTokenPayload,
  JwtRefreshTokenDecoded,
  JwtRefreshTokenPayload,
} from './types/JwtPayload.type';
import { Token, User } from '@prisma/client';
import { TokensResponse } from './dtos/tokens.response';
import { AuthResponse } from './dtos/auth.response';
import { UserEntity } from '../users/dtos/user.entity';
import { LoginDto } from './dtos/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private usersService: UsersService,
    private configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthResponse> {
    const user = await this.usersService.createUser(registerDto, {
      createActivated: false,
    });

    const tokens = await this.generateAndSaveTokens(user);
    return {
      user: new UserEntity(user),
      ...tokens,
    };
  }

  async login(loginDto: LoginDto): Promise<AuthResponse> {
    const user = await this.usersService.findByEmail(loginDto.email);

    if (!user) throw new BadRequestException('User does not exist');

    const passwordMatches = await argon2.verify(
      user.password,
      loginDto.password,
    );

    if (!passwordMatches)
      throw new BadRequestException('Password is incorrect');

    const tokens = await this.generateAndSaveTokens(user);
    return {
      user: new UserEntity(user),
      ...tokens,
    };
  }

  async logout(tokenId: string) {
    if (!tokenId) {
      throw new BadRequestException('Token ID required');
    }

    const foundToken: Token = await this.prisma.token.findUnique({
      where: { id: tokenId },
    });

    if (foundToken) {
      await this.prisma.token.delete({ where: { id: tokenId } });
    }
  }

  async refreshTokens(
    tokenId: string,
    refreshToken: string,
  ): Promise<TokensResponse> {
    if (!tokenId || !refreshToken) {
      throw new BadRequestException('Token ID and refresh token are required');
    }

    const decodedToken = this.jwtService.decode(
      refreshToken,
    ) as JwtRefreshTokenDecoded;

    if (decodedToken.exp * 1000 < Date.now()) {
      throw new HttpException(
        'Refresh token has expired',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const foundToken = await this.prisma.token.findUnique({
      where: {
        id: tokenId,
      },
    });

    if (foundToken == null) {
      throw new HttpException(
        'Refresh token not found',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const isMatch = await argon2.verify(
      foundToken.refreshToken ?? '',
      refreshToken,
    );

    if (!isMatch) {
      throw new HttpException('Invalid refresh token', HttpStatus.UNAUTHORIZED);
    }

    const user: User = await this.prisma.user.findUnique({
      where: { id: foundToken.userId },
    });

    await this.prisma.token.delete({ where: { id: foundToken.id } });

    return this.generateAndSaveTokens(user);
  }

  async generateAndSaveTokens(user: User): Promise<TokensResponse> {
    const accessToken = await this.signAccessToken(user);
    const refreshToken: string = await this.signRefreshToken(user);
    const token: Token = await this.saveRefreshToken(user, refreshToken);

    return { accessToken, refreshToken, tokenId: token.id };
  }

  signAccessToken(user): Promise<string> {
    const jwtAccessTokenPayload: JwtAccessTokenPayload = {
      userId: user.id,
      username: user.username,
      email: user.email,
    };

    return this.jwtService.signAsync(jwtAccessTokenPayload, {
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      expiresIn: this.configService.get<number>('JWT_ACCESS_LIFE'),
    });
  }

  signRefreshToken(user): Promise<string> {
    const jwtRefreshTokenPayload: JwtRefreshTokenPayload = {
      userId: user.id,
    };
    return this.jwtService.signAsync(jwtRefreshTokenPayload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get<number>('JWT_REFRESH_LIFE'),
    });
  }

  async saveRefreshToken(user: User, refreshToken: string): Promise<Token> {
    const decodeToken = this.jwtService.decode(
      refreshToken,
    ) as JwtRefreshTokenDecoded | null;

    const hashedRefreshToken = await argon2.hash(refreshToken);

    const token: Token = await this.prisma.token.create({
      data: {
        user: { connect: { id: user.id } },
        refreshToken: hashedRefreshToken,
        expiresAt: new Date(decodeToken.iat * 1000),
        createdAt: new Date(decodeToken.exp * 1000),
      },
    });

    return token;
  }
}
