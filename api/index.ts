import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import type { Request, Response } from 'express';
import express, { Express } from 'express';

const server: Express = express();
let app: INestApplication;

async function bootstrap() {
  if (!app) {
    app = await NestFactory.create(
      AppModule,
      new ExpressAdapter(server),
    );

    app.enableCors({
      origin: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      credentials: true,
    });

    const config = new DocumentBuilder()
      .setTitle('Hotel Management API')
      .setDescription('The Hotel Management API description')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    await app.init();
  }
  return server;
}

export default async (req: Request, res: Response) => {
  await bootstrap();
  server(req, res);
};
