import cookieParser from 'cookie-parser';

import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [],
  });
  app.enableVersioning({
    defaultVersion: '1',
    type: VersioningType.URI,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.use(cookieParser());
  const options = new DocumentBuilder()
    .setTitle('Petstore API')
    .setDescription('Petstore API from ravn challenge')
    .setVersion('1.0')
    .addBearerAuth()
    .setContact(
      'Daniel',
      'https://github.com/danqwas',
      'daniel.echegaray.apac@outlook.com.pe',
    )
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api-docs', app, document);
  await app.listen(3000);
}
bootstrap();
