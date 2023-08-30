import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { GetUserProfileMiddleware } from './middleware/getUserProfile';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { IsFieldAllreadyExists } from './validators/isFieldAllreadyExists.validator';
import { UsersService } from './users.service';
import { PrismaModule, PrismaService } from 'nestjs-prisma';
import { UsersController } from './users.controller';
import { EmailService } from '../email/email.service';
import { EmailModule } from '../email/email.module';
import { ConfigModule } from '@nestjs/config';
import { ReadUserProfilePolicyProvider } from './policies/readUserProfile.provider';

@Module({
  imports: [ConfigModule, EmailModule, PrismaModule, JwtModule.register({})],
  controllers: [UsersController],
  providers: [
    UsersService,
    EmailService,
    IsFieldAllreadyExists,
    JwtService,
    PrismaService,
    ReadUserProfilePolicyProvider,
  ],
  exports: [UsersService, ReadUserProfilePolicyProvider],
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
