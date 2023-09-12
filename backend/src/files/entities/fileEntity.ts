import { TrackFile } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

export class FileEntity implements TrackFile {
  id: number;

  @ApiProperty()
  @Expose()
  fileName: string;

  @ApiProperty()
  @Expose()
  bitrate: number;

  @ApiProperty()
  @Expose()
  duration: number;

  @ApiProperty()
  @Expose()
  fileSize: number;

  @ApiProperty()
  @Expose()
  mime: string;

  @ApiProperty()
  @Expose()
  md5: string;

  @Exclude()
  isActive: boolean;

  @Exclude()
  trackId: number;

  constructor(partial?: Partial<FileEntity>) {
    Object.assign(this, partial);
  }
}
