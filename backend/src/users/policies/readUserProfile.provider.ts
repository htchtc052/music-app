import { Provider } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { ReadUserProfilePolicyHandler } from './readUserProfile.policy';
import RequestWithUserProfile from '../types/requestWithUserProfile';

export const ReadUserProfilePolicyProvider: Provider = {
  provide: ReadUserProfilePolicyHandler,
  inject: [REQUEST],
  useFactory: (request: RequestWithUserProfile) => {
    const userProfile = request.userProfile;
    return () => new ReadUserProfilePolicyHandler(userProfile);
  },
};
