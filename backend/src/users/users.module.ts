import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from './users.service';
import { PrismaModule, PrismaService } from 'nestjs-prisma';
import { UsersController } from './users.controller';
import { EmailService } from '../email/email.service';
import { EmailModule } from '../email/email.module';
import { ConfigModule } from '@nestjs/config';
import { IsFieldAllreadyExists } from './isFieldAllreadyExists.validator';
import { GetUserProfileMiddleware } from './getUserProfile.middleware';

@Module({
  imports: [ConfigModule, EmailModule, PrismaModule],
  controllers: [UsersController],
  providers: [
    UsersService,
    EmailService,
    IsFieldAllreadyExists,
    JwtService,
    PrismaService,
  ],
  exports: [UsersService],
})
export class UsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(GetUserProfileMiddleware)
      .forRoutes(
        { path: 'users/:id', method: RequestMethod.GET },
        { path: 'users/:id', method: RequestMethod.PUT },
      );
  }
}
