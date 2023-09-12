import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UploadedFileDto {
  @IsNotEmpty()
  @IsString()
  filename: string;

  @IsNotEmpty()
  @IsNumber()
  size: number;
}
