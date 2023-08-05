import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from 'nestjs-prisma';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { EmailModule } from '../email/email.module';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';
import { EmailService } from '../email/email.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    JwtModule.register({}),
    PrismaModule,
    UsersModule,
    EmailModule,
    ConfigModule,
  ],
  controllers: [AuthController],

  providers: [AuthService, JwtService, UsersService, EmailService],
})
export class AuthModule {}
