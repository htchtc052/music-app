import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Track, TrackFile } from '@prisma/client';

export class TrackEntity implements Track {
  @ApiProperty({ required: true })
  @Expose()
  id: number;

  @ApiProperty({ required: true })
  @Expose()
  userId: number;

  @ApiProperty({ required: true })
  @Expose()
  title: string;

  @Expose()
  description: string;

  @ApiProperty()
  @Expose()
  keywords: string[];

  @ApiProperty()
  @Expose()
  createdAt: Date;

  @ApiProperty()
  @Expose()
  updatedAt: Date;

  @ApiProperty()
  @Expose()
  private: boolean;

  @Expose({ groups: ['isOwner'] })
  hiddenDescription: string;

  @Exclude()
  deletedAt: Date;

  @ApiProperty({ name: 'file' })
  @Expose({ name: 'file' })
  file: TrackFile;

  constructor(partial?: Partial<TrackEntity>) {
    Object.assign(this, partial);
  }
}
