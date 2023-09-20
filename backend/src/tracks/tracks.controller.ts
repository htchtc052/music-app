import { ApiOperation } from '@nestjs/swagger';
import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  Put,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import RequestWithTrack from './interfaces/requestWithTrack.interface';
import { TrackEntity } from './entities/track.entity';
import { PoliciesGuard } from '../casl/policies.guard';
import { CheckPolicies } from '../casl/policies.decorator';
import { ReadTrackHandler } from '../casl/policies/readTrack.handler';
import { Public } from 'src/auth/decorators/public.decorator';
import { Track, User } from '@prisma/client';
import { AuthUser } from '../auth/decorators/authUser.decorator';
import { TracksService } from './tracks.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { EditTrackInfoDto } from './dtos/editTrackInfo.dto';

@Controller('tracks')
export class TracksController {
  constructor(
    private tracksService: TracksService,
    private configService: ConfigService,
  ) {}

  @Post()
  @UseInterceptors(ClassSerializerInterceptor)
  @UseInterceptors(
    FileInterceptor('trackFile', {
      fileFilter: (req, file, cb) => {
        if (file.mimetype === 'audio/mpeg') {
          cb(null, true);
        } else {
          cb(new BadRequestException('File must be an mp3'), false);
        }
      },
    }),
  )
  createTrack(
    @AuthUser() authUser: User,
    @UploadedFile()
    uploadedFile: Express.Multer.File,
  ): any {
    return this.tracksService.createTrack(uploadedFile, authUser);
  }

  @ApiOperation({ summary: 'Edit track info' })
  @Put(':id/editInfo')
  @UseInterceptors(ClassSerializerInterceptor)
  async editInfo(
    @Body() editTrackInfoDto: EditTrackInfoDto,
    @Req() request: RequestWithTrack,
  ): Promise<string> {
    const track: Track = request.track;
    await this.tracksService.editInfo(track, editTrackInfoDto);

    return 'Track updated successfully';
  }

  @ApiOperation({ summary: 'Get track by id' })
  @Public()
  @Get(':id')
  @CheckPolicies(ReadTrackHandler)
  @UseGuards(PoliciesGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  getTrack(@Req() request: RequestWithTrack) {
    return new TrackEntity(request.track);
  }
}
