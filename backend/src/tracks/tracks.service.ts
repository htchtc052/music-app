import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { Track, TrackFile, User } from '@prisma/client';
import { TrackEntity } from './entities/track.entity';
import { ConfigService } from '@nestjs/config';
import { EditTrackInfoDto } from './dtos/editTrackInfo.dto';

@Injectable()
@Injectable()
export class TracksService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  async createTrack(
    uploadedTrackFile: Express.Multer.File,
    user: User,
  ): Promise<TrackEntity> {
    const track: Track = await this.prisma.track.create({
      data: { title: uploadedTrackFile.originalname, userId: user.id },
    });

    const file: TrackFile = await this.prisma.trackFile.create({
      data: {
        fileName: uploadedTrackFile.filename,
        fileSize: uploadedTrackFile.size,
        filePath:
          this.configService.get<string>('BACKEND_URL') +
          '/' +
          uploadedTrackFile.path,
        mimetype: uploadedTrackFile.mimetype,
        trackId: track.id,
      },
    });

    return { ...track, file };
  }

  findById(id: number): Promise<Track> {
    return this.prisma.track.findUnique({
      where: {
        id,
      },
    });
  }

  async editInfo(
    track: Track,
    editTrackInfoDto: EditTrackInfoDto,
  ): Promise<void> {
    await this.prisma.track.update({
      where: { id: track.id },
      data: {
        title: editTrackInfoDto.title,
        description: editTrackInfoDto.description,
        hiddenDescription: editTrackInfoDto.hiddenDescription,
        private: editTrackInfoDto.private,
      },
    });
  }

  async findWithFileById(id: number): Promise<Track> {
    const track: Track = await this.prisma.track.findUnique({
      where: {
        id,
      },
      include: {
        file: true,
      },
    });

    if (!track) {
      throw new NotFoundException('Track not found');
    }

    return track;
  }

  async getTracksByUser(user: User, readAsOwner: boolean): Promise<Track[]> {
    const where: { userId: number; private?: boolean } = {
      userId: user.id,
    };

    if (!readAsOwner) {
      where.private = false;
    }

    const tracks: Track[] = await this.prisma.track.findMany({
      where,
      include: {
        file: true,
      },
    });

    return tracks;
  }
}
