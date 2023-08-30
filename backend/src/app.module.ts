import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { LangModule } from './lang.module';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { CaslModule } from './casl/casl.module';

@Module({
  imports: [
    //ServeStaticModule.forRoot({rootPath: path.resolve(__dirname, 'static')}),
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
      }),
      validationOptions: {
        allowUnknown: true,
        abortEarly: false,
      },
    }),
    LangModule,
    UsersModule,
    AuthModule,
    CaslModule,
  ],
  controllers: [],
})
export class AppModule {}
