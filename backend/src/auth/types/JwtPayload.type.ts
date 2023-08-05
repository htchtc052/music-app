export type JwtParams = {
  exp: number;
  iat: number;
};

export type JwtAccessTokenPayload = {
  userId: number;
  username: string;
  email: string;
};

export type JwtAccessTokenDecoded = JwtAccessTokenPayload & JwtParams;

export type JwtRefreshTokenPayload = {
  userId: number;
};

export type JwtRefreshTokenDecoded = JwtRefreshTokenPayload & JwtParams;
