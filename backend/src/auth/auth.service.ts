import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'nestjs-prisma';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as argon2 from 'argon2';
import { v4 as uuidv4 } from 'uuid';
import { Token, User } from '@prisma/client';
import { LoginDto } from './dtos/login.dto';
import { RegisterDto } from './dtos/register.dto';
import { AuthResponse } from './responses/auth.response';
import { CreateUserInput } from '../users/types/createUserInput.type';
import { UserEntity } from '../users/entities/user.entity';
import { TokensResponse } from './responses/tokens.response';
import { JwtTokenDecoded } from './types/JwtPayload.type';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private usersService: UsersService,
    private configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthResponse> {
    const createUserInput: CreateUserInput = {
      username: registerDto.username,
      email: registerDto.email,
      password: registerDto.password,
    };

    const user = await this.usersService.createUser(createUserInput, {
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

    let tokenPayload: JwtTokenDecoded;
    try {
      tokenPayload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });
    } catch (err) {
      console.error(err);

      throw new UnauthorizedException('Invalid token');
    }
    if (!tokenPayload) {
      throw new UnauthorizedException('Refresh token invalid');
    }

    if (tokenPayload.exp * 1000 < Date.now()) {
      throw new HttpException(
        'Refresh token has expired',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const foundToken: Token = await this.prisma.token.findUnique({
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
      throw new HttpException(
        'Refresh token not found',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const user: User = await this.prisma.user.findUnique({
      where: { id: foundToken.userId },
    });

    await this.prisma.token.delete({ where: { id: foundToken.id } });

    return this.generateAndSaveTokens(user);
  }

  async generateAndSaveTokens(user: User): Promise<TokensResponse> {
    const accessToken = await this.signAccessToken(user);
    const refreshToken = await this.signRefreshToken(user);

    const refreshTokenDecoded: JwtTokenDecoded = this.jwtService.decode(
      refreshToken,
    ) as JwtTokenDecoded | null;

    const hashedRefreshToken = await argon2.hash(refreshToken);

    const token: Token = await this.prisma.token.create({
      data: {
        user: { connect: { id: user.id } },
        refreshToken: hashedRefreshToken,
        expiresAt: new Date(refreshTokenDecoded.iat * 1000),
        createdAt: new Date(refreshTokenDecoded.exp * 1000),
      },
    });

    return { accessToken, refreshToken, tokenId: token.id };
  }

  private async signAccessToken(user: User): Promise<string> {
    return this.jwtService.signAsync(
      { sid: uuidv4() },
      {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: this.configService.get<string>('JWT_ACCESS_LIFE'),
        subject: user.id.toString(),
      },
    );
  }

  private async signRefreshToken(user: User): Promise<string> {
    return this.jwtService.signAsync(
      { sid: uuidv4() },
      {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get<string>('JWT_REFRESH_LIFE'),
        subject: user.id.toString(),
      },
    );
  }
}
