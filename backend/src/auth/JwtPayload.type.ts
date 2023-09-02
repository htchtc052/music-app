export type JwtParams = {
  exp: number;
  iat: number;
};

export type JwtTokenPayload = {
  sub: number;
};

export type JwtTokenDecoded = JwtTokenPayload & JwtParams;
