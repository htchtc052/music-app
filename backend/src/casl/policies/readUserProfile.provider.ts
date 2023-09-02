import { Provider } from '@nestjs/common';
import { ReadUserProfileHandler } from './readUserProfile.handler';
import { REQUEST } from '@nestjs/core';
import { User } from '@prisma/client';
import RequestWithUserProfileInterface from '../../users/requestWithUserProfile.interface';

export const ReadUserProfileProvider: Provider = {
  provide: ReadUserProfileHandler,
  inject: [REQUEST],
  useFactory: (request: RequestWithUserProfileInterface) => {
    const userProfile: User = request.userProfile;
    return new ReadUserProfileHandler(userProfile);
  },
};
