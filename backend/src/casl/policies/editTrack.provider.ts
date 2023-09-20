import { Provider } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import RequestWithTrackInterface from '../../tracks/interfaces/requestWithTrack.interface';
import { Track } from '@prisma/client';
import { EditTrackHandler } from './editTrack.handler';

export const EditTrackProvider: Provider = {
  provide: EditTrackHandler,
  inject: [REQUEST],
  useFactory: (request: RequestWithTrackInterface) => {
    const track: Track = request.track;
    return new EditTrackHandler(track);
  },
};
