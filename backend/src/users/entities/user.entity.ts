import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Genders, User } from '@prisma/client';

export class UserEntity implements User {
  @ApiProperty({ required: true })
  @Expose()
  id: number;

  @ApiProperty({ required: true })
  @Expose()
  username: string;

  @ApiProperty({ required: true })
  @Expose()
  email: string;

  @ApiProperty()
  @Expose()
  firstname: string;

  @ApiProperty()
  @Expose()
  lastname: string;

  @ApiProperty()
  @Expose()
  gender: Genders;

  @ApiProperty()
  @Expose()
  birthday: Date;

  @Exclude()
  activationToken: string;

  @Exclude()
  activatedAt: Date;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Exclude()
  deletedAt: Date;

  @Exclude()
  isAdmin: boolean;

  @Exclude()
  password: string;

  constructor(partial?: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
