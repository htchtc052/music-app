import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { i18nValidationMessage } from 'nestjs-i18n';

export class EditTrackInfoDto {
  @ApiProperty({ example: 'My song', description: 'Track title' })
  @IsNotEmpty({
    message: i18nValidationMessage('validation.TRACKTITLE_NOT_EMPTY'),
  })
  title: string;

  @ApiProperty({ example: 'My awesome song', description: 'Track description' })
  description?: string;

  @ApiProperty({
    example: 'My awesome hidden song',
    description: 'Track hidden description',
  })
  hiddenDescription?: string;
}
