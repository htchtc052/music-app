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

  async findWithFileById(id: number): Promise<Track> {
    const track: Track = await this.prisma.track.findUnique({
      where: {
        id,
        deletedAt: null,
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
    const where: { userId: number; private?: boolean; deletedAt: Date | null } =
      {
        userId: user.id,
        deletedAt: null,
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

  async editInfo(
    track: Track,
    editTrackInfoDto: EditTrackInfoDto,
  ): Promise<Track> {
    const updatedTrack: Track = await this.prisma.track.update({
      where: { id: track.id },
      data: {
        title: editTrackInfoDto.title,
        description: editTrackInfoDto.description,
        hiddenDescription: editTrackInfoDto.hiddenDescription,
        private: editTrackInfoDto.private,
      },
      include: {
        file: true,
      },
    });

    return updatedTrack;
  }

  async deleteTrack(track: Track): Promise<void> {
    await this.prisma.track.update({
      where: { id: track.id },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
