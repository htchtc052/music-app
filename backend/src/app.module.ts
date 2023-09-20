import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { LangModule } from './lang.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { CaslModule } from './casl/casl.module';
import { AccountModule } from './account/account.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PrismaModule } from 'nestjs-prisma';
import { TracksModule } from './tracks/tracks.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwtAuthGuard';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads', // Optional: This sets the root URL for serving static files.
    }),
    ConfigModule.forRoot({
      envFilePath: `.env`,
      isGlobal: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test', 'provision')
          .default('development'),
        FRONTEND_URL: Joi.string().required(),
        BACKEND_URL: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        JWT_REFRESH_SECRET: Joi.string().required(),
        JWT_ACCESS_LIFE: Joi.string().required(),
        JWT_REFRESH_LIFE: Joi.string().required(),
        SMTP_HOST: Joi.string().required(),
        SMTP_PORT: Joi.number().required(),
        SMTP_USER: Joi.string().required(),
        SMTP_PASS: Joi.string().allow(''),
        MAIL_PREVIEW_BROWSER: Joi.boolean().default(false),
        PRISMA_LOG: Joi.string().default('warn'),
      }),
      validationOptions: {
        allowUnknown: true,
        abortEarly: false,
      },
    }),
    JwtModule.register({ global: true }),
    LangModule,
    CaslModule,
    AuthModule,
    AccountModule,
    UsersModule,
    TracksModule,
    PrismaModule.forRootAsync({
      isGlobal: true,
      useFactory: async (configService: ConfigService) => {
        return {
          prismaOptions: {
            log: configService.get('PRISMA_LOG').split(','),
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    JwtService,
  ],
})
export class AppModule {}
