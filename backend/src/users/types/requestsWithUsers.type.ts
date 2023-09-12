import { User } from '@prisma/client';
import { Request } from 'express';
import { AppAbility } from '../../casl/ability.factory';

export type RequestWithAuthUser = Request & {
  authUser: User;
  authUserAbility: AppAbility;
};

type UserProfile = {
  userProfile: User;
};

export type RequestWithUserProfile = RequestWithAuthUser & UserProfile;
