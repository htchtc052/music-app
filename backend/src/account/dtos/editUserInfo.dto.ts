import { ApiProperty, PickType } from '@nestjs/swagger';
import { RegisterDto } from '../../auth/dtos/register.dto';

export class EditUserInfoDto extends PickType(RegisterDto, [
  'username',
] as const) {
  @ApiProperty({ example: 'John', required: false })
  firstname?: string;

  @ApiProperty({ example: 'Doe', required: false })
  lastname?: string;
}
