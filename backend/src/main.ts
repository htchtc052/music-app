import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { I18nValidationExceptionFilter, I18nValidationPipe } from 'nestjs-i18n';
import { useContainer } from 'class-validator';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder().setTitle('MyMusic App API').build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  app.useGlobalPipes(new I18nValidationPipe());

  app.useGlobalFilters(
    new I18nValidationExceptionFilter({
      errorFormatter: (errors) => {
        //console.debug(errors);
        const errorMessages = [];
        errors.forEach((error) => {
          const errorObj = {
            [`${error.property}`]: Object.values(error.constraints)[0],
          };

          errorMessages.push(errorObj);
        });

        return errorMessages;
      },
    }),
  );

  await app.listen(3000);
}

bootstrap();
