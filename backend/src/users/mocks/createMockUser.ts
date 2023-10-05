import {
  randNumber,
  randPassword,
  randPastDate,
  randUser,
} from '@ngneat/falso';
import { UserEntity } from '../entities/user.entity';
import { Genders } from '@prisma/client';

export const createMockUser = (): UserEntity => {
  const { id, email, username, firstName, lastName } = randUser();
  const password = randPassword();
  return {
    id: randNumber(),
    username,
    email,
    password,
    firstname: firstName,
    lastname: lastName,
    createdAt: randPastDate(),
    activatedAt: randPastDate(),
    updatedAt: null,
    gender: Genders.MALE,
    birthday: randPastDate(),
    isAdmin: false,
    deletedAt: null,
    activationToken: null,
  };
};
