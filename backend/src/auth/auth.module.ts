import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from 'nestjs-prisma';
import { EmailModule } from '../email/email.module';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';
import { EmailService } from '../email/email.service';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    EmailModule,
    ConfigModule,
    JwtModule.register({}),
  ],
  controllers: [AuthController],

  providers: [AuthService, UsersService, EmailService],
})
export class AuthModule {}
