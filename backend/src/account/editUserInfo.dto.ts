import { PickType } from '@nestjs/swagger';
import { RegisterDto } from '../auth/dtos/register.dto';

export class EditUserInfoDto extends PickType(RegisterDto, [
  'username',
] as const) {}
