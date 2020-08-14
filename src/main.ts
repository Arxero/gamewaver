import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe, NestApplicationOptions } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as fs from 'fs';

async function bootstrap() {
  let nestOptions: NestApplicationOptions;

  // uncomment to add https locally
  // don't forget to add https in HOST_URL in .env file
  // if (process.env.HOST_DEVELOP  === 'true') {
  //   nestOptions = {
  //     httpsOptions: {
  //       key: fs.readFileSync('server.key'),
  //       cert: fs.readFileSync('server.cert'),
  //     },
  //   };
  // }

  const app = await NestFactory.create(AppModule, nestOptions);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('host.port');
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin: [
      'http://gamewaver.com',
      'https://gamewaver.com',
      'http://localhost:4200',
      'https://localhost:4200',
    ],
    exposedHeaders: ['Content-Length', 'Access-Control-Allow-Origin'],
    credentials: true,
  });

  const options = new DocumentBuilder()
    .setTitle('Gamewaver API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('', app, document);

  await app.listen(port);
  Logger.log(`Server running on http://localhost:${port}`, 'Bootstrap');
}
bootstrap();
