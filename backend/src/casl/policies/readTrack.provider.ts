import { Provider } from '@nestjs/common';
import { ReadTrackHandler } from './readTrack.handler';
import { REQUEST } from '@nestjs/core';
import RequestWithTrackInterface from '../../tracks/interfaces/requestWithTrack.interface';
import { Track } from '@prisma/client';

export const ReadTrackProvider: Provider = {
  provide: ReadTrackHandler,
  inject: [REQUEST],
  useFactory: (request: RequestWithTrackInterface) => {
    const track: Track = request.track;
    return new ReadTrackHandler(track);
  },
};
