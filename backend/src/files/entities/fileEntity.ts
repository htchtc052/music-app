import { TrackFile } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class FileEntity implements TrackFile {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  fileName: string;

  @ApiProperty()
  @Expose()
  filePath: string;

  @ApiProperty()
  @Expose()
  fileSize: number;

  @ApiProperty()
  @Expose()
  mimetype: string;

  @ApiProperty()
  @Expose()
  trackId: number;

  constructor(partial?: Partial<FileEntity>) {
    Object.assign(this, partial);
  }
}
