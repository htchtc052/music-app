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
import { User } from '@prisma/client';
import { JwtTokenDecoded } from '../types/JwtPayload.type';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { UsersService } from '../../users/users.service';
import { RequestWithAuthUser } from '../../users/types/requestsWithUsers.type';
import { AbilityFactory } from '../../casl/ability.factory';

@Injectable()
export class JwtAuthGuard {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly reflector: Reflector,
    private readonly userService: UsersService,
    private readonly abilityFactory: AbilityFactory,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithAuthUser>();
    const token = this.extractTokenFromHeader(request);

    const isPublic: boolean = this.reflector.get<boolean>(
      IS_PUBLIC_KEY,
      context.getHandler(),
    );

    if (!token && !isPublic) {
      throw new ForbiddenException('Auth required');
    }

    let user: User;

    if (token) {
      let payload: JwtTokenDecoded;
      try {
        payload = await this.jwtService.verifyAsync(token, {
          secret: this.configService.get<string>('JWT_SECRET'),
        });
      } catch (err) {
        // Case 2: The client has a token, but it is not valid
        throw new UnauthorizedException('Invalid token');
      }

      // Case 3: The client has a valid token
      try {
        user = await this.userService.findById(+payload.sub);
      } catch (err) {
        throw new UnauthorizedException('Auth user not found');
      }
    }
    request.authUser = user;
    request.authUserAbility = this.abilityFactory.createForUser(
      request.authUser,
    );

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
