import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, Validate } from 'class-validator';
import { MinLengthCustom } from '../../common/minLengthCustom.decorator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { Match } from '../../common/match.decorator';
import { IsFieldAllreadyExists } from '../../users/validators/isFieldAllreadyExists.validator';

export class RegisterDto {
  @ApiProperty({
    name: 'User name',
    description: 'User name descr',
  })
  @IsNotEmpty({
    message: i18nValidationMessage('validation.USERNAME_NOT_EMPTY'),
  })
  username: string;

  @ApiProperty({
    description: 'User email',
  })
  @IsNotEmpty({ message: i18nValidationMessage('validation.EMAIL_NOT_EMPTY') })
  @IsEmail({}, { message: i18nValidationMessage('validation.EMAIL_INVALID') })
  @Validate(IsFieldAllreadyExists, {
    message: i18nValidationMessage('validation.EMAIL_BUSY'),
  })
  email: string;

  @ApiProperty({
    description: 'User password',
  })
  @IsNotEmpty({
    message: i18nValidationMessage('validation.PASSWORD_NOT_EMPTY'),
  })
  @MinLengthCustom(4, {
    message: i18nValidationMessage('validation.PASSWORD_MIN', { count: 4 }),
  })
  password: string;

  @ApiProperty({ description: 'Password confirmation' })
  @IsNotEmpty({
    message: i18nValidationMessage('validation.PASSWORD_CONFIRM_NOT_EMPTY'),
  })
  @Match(RegisterDto, (s: RegisterDto) => s.password, {
    message: i18nValidationMessage('validation.PASSWORD_CONFIRM_NOT_MATCH'),
  })
  passwordConfirm: string;
}
