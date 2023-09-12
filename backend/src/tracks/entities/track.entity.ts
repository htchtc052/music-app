import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Track } from '@prisma/client';
import { FileEntity } from '../../files/entities/fileEntity';

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
  isAdult: boolean;

  @ApiProperty()
  @Expose()
  private: boolean;

  @Expose({ groups: ['isOwner'] })
  hiddenDescription: string;

  @Exclude()
  deletedAt: Date;

  @ApiProperty({ name: 'file' })
  @Expose({ name: 'file' })
  @Transform(({ value }) => ({ ...value[0] }), { toPlainOnly: true })
  @Type(() => FileEntity)
  files: FileEntity;

  constructor(partial?: Partial<TrackEntity>) {
    Object.assign(this, partial);
  }
}
