import { TokensResponse } from './tokens.response';
import { IntersectionType } from '@nestjs/swagger';
import { UserResponse } from '../../users/user.response';

export class AuthResponse extends IntersectionType(
  TokensResponse,
  UserResponse,
) {}
