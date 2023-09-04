import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateUserInput, CreateUserOptions } from './createUserInput.type';

import { v4 as uuid } from 'uuid';
import * as argon2 from 'argon2';
import { User } from '@prisma/client';
import { EmailService } from '../email/email.service';
import { EditUserInfoDto } from '../account/editUserInfo.dto';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
  ) {}

  async createUser(
    createUserInput: CreateUserInput,
    createUserOptions: CreateUserOptions,
  ): Promise<User> {
    const hashedPassword = await argon2.hash(createUserInput.password);
    createUserInput.password = hashedPassword;

    let user: User;
    if (createUserOptions.createActivated) {
      user = await this.prisma.user.create({
        data: { password: hashedPassword, ...createUserInput },
      });
    } else {
      const activationToken: string = uuid();
      user = await this.prisma.user.create({
        data: { password: hashedPassword, activationToken, ...createUserInput },
      });

      await this.emailService.sendActivationEmail(user);
    }

    return user;
  }

  editInfo(user: User, editUserInfoDto: EditUserInfoDto): Promise<User> {
    return this.prisma.user.update({
      where: { id: user.id },
      data: editUserInfoDto,
    });
  }

  findById(id: number): Promise<User> {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  findByEmail(email: string): Promise<User> {
    return this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async checkFieldBusy(
    fieldName: string,
    fieldValue: string,
  ): Promise<boolean> {
    return !(await this.prisma.user.count({
      where: {
        [fieldName]: fieldValue,
      },
    }));
  }
}
