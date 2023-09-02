import { Request } from 'express';
import { User } from '@prisma/client';

interface RequestWithAuthUser extends Request {
  authUser: User;
}

export default RequestWithAuthUser;
