import { ApiOperation } from '@nestjs/swagger';
import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import RequestWithTrack from './interfaces/requestWithTrack.interface';
import { TrackEntity } from './entities/track.entity';
import { PoliciesGuard } from '../casl/policies.guard';
import { CheckPolicies } from '../casl/policies.decorator';
import { ReadTrackHandler } from '../casl/policies/readTrack.handler';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('tracks')
export class TracksController {
  @ApiOperation({ summary: 'Get own user' })
  @Public()
  @Get(':id')
  @CheckPolicies(ReadTrackHandler)
  @UseGuards(PoliciesGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  getTrack(@Req() request: RequestWithTrack) {
    return new TrackEntity(request.track);
  }
}
