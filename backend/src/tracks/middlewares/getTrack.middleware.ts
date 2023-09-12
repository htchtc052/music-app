import { Injectable, NestMiddleware, NotFoundException } from '@nestjs/common';

import { NextFunction, Response } from 'express';
import { TracksService } from '../tracks.service';
import RequestWithTrack from '../interfaces/requestWithTrack.interface';

@Injectable()
export class GetTrackMiddleware implements NestMiddleware {
  constructor(private readonly tracksService: TracksService) {}

  async use(req: RequestWithTrack, res: Response, next: NextFunction) {
    const id = parseInt(req.params.id);

    if (!id) {
      throw new NotFoundException(`Missing track id`);
    }
    const track = await this.tracksService.findWithFileById(id);

    req.track = track;
    next();
  }
}
