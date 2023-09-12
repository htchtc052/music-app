import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { EmailService } from '../email/email.service';
import { EmailModule } from '../email/email.module';
import { ConfigModule } from '@nestjs/config';
import { IsFieldAllreadyExists } from './validators/isFieldAllreadyExists.validator';
import { GetUserProfileMiddleware } from './middlewares/getUserProfile.middleware';
import { TracksModule } from '../tracks/tracks.module';
import { TracksService } from '../tracks/tracks.service';

@Module({
  imports: [ConfigModule, EmailModule, TracksModule],
  controllers: [UsersController],
  providers: [
    UsersService,
    EmailService,
    IsFieldAllreadyExists,
    JwtService,
    TracksService,
  ],
  exports: [UsersService],
})
export class UsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(GetUserProfileMiddleware).forRoutes(UsersController);
  }
}
