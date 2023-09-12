import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from '../entities/user.entity';

export class UserResponse {
  @ApiProperty()
  user: UserEntity;
}
