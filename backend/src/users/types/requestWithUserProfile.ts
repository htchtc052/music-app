import { User } from '@prisma/client';
import { Request } from 'express';

interface RequestWithUserProfile extends Request {
  userProfile: User;
}

export default RequestWithUserProfile;
