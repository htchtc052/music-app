import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { Track, User } from '@prisma/client';

@Injectable()
@Injectable()
export class TracksService {
  constructor(private prisma: PrismaService) {}

  async createTrack() {
    return Promise.resolve();
  }

  findById(id: number): Promise<Track> {
    return this.prisma.track.findUnique({
      where: {
        id,
      },
    });
  }

  async findWithFileById(id: number): Promise<Track> {
    const track = await this.prisma.track.findUnique({
      where: {
        id,
      },
      include: {
        files: {
          where: {
            isActive: true,
          },
        },
      },
    });

    if (!track) {
      throw new NotFoundException('Track not found');
    }

    return track;
  }

  async getTracksByUser(user: User, readAsOwner: boolean): Promise<Track[]> {
    let where = {};

    if (readAsOwner) {
      where = { userId: user.id };
    } else {
      where = { userId: user.id, private: false };
    }

    const tracks = await this.prisma.track.findMany({
      where,
      include: {
        files: {
          where: {
            isActive: true,
          },
        },
      },
    });

    return tracks;
  }
}
