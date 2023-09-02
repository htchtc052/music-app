import { OmitType } from '@nestjs/swagger';
import { RegisterDto } from '../auth/dtos/register.dto';

export class CreateUserInput extends OmitType(RegisterDto, [
  'passwordConfirm',
] as const) {}

export type CreateUserOptions = {
  readonly createActivated: boolean;
};
