import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from './user.entity';

export class UserResponse {
  @ApiProperty()
  user: UserEntity;
}
