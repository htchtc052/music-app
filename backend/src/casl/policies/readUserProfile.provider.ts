import { Provider } from '@nestjs/common';
import { ReadUserProfileHandler } from './readUserProfile.handler';
import { REQUEST } from '@nestjs/core';
import RequestWithUserProfile from '../../users/types/requestWithUserProfile';

export const ReadUserProfileProvider: Provider = {
  provide: ReadUserProfileHandler,
  inject: [REQUEST],
  useFactory: (request: RequestWithUserProfile) => {
    const userProfile = request.userProfile;
    return () => new ReadUserProfileHandler(userProfile);
  },
};
