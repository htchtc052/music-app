import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { UsersService } from '../users/users.service';
import { User } from '@prisma/client';
import { JwtTokenDecoded } from './JwtPayload.type';
import { IS_PUBLIC_KEY } from './public.decorator';
import RequestWithAuthUser from '../users/requestWithAuthUser.interface';

@Injectable()
export class JwtAuthGuard {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private configService: ConfigService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithAuthUser>();
    const token = this.extractTokenFromHeader(request);

    const isPublic: boolean = this.reflector.get<boolean>(
      IS_PUBLIC_KEY,
      context.getHandler(),
    );

    let user: User;

    if (token) {
      let payload: JwtTokenDecoded;
      try {
        payload = await this.jwtService.verifyAsync(token, {
          secret: this.configService.get<string>('JWT_SECRET'),
        });
      } catch (err) {
        console.error(err.stack);
        // Case 2: The client has a token, but it is not valid
        throw new UnauthorizedException('Invalid token');
      }

      // Case 3: The client has a valid token
      user = await this.usersService.findById(+payload.sub);
    }
    request.authUser = user;
    if (!request.authUser && !isPublic) {
      throw new ForbiddenException('Auth required');
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
