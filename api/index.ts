import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import type { Request, Response } from 'express';
import express from 'express';

const expressApp = express();
let isAppInitialized = false;

async function initializeApp() {
  if (!isAppInitialized) {
    const adapter = new ExpressAdapter(expressApp);
    const app: INestApplication = await NestFactory.create(
      AppModule,
      adapter,
      { logger: ['error', 'warn', 'log'] }
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
    isAppInitialized = true;
  }
}

export default async (req: Request, res: Response) => {
  await initializeApp();
  expressApp(req, res);
};
