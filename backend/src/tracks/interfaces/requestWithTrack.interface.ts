import { Request } from 'express';
import { Track } from '@prisma/client';

interface RequestWithTrack extends Request {
  track: Track;
}

export default RequestWithTrack;
