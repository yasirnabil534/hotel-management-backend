import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from '../src/app.module';
import type { NestExpressApplication } from '@nestjs/platform-express';

let cachedApp: NestExpressApplication;

async function bootstrapServer() {
  if (!cachedApp) {
    const app = await NestFactory.create<NestExpressApplication>(
      AppModule,
      new ExpressAdapter(),
      { 
        logger: ['error', 'warn', 'log'],
        abortOnError: false 
      }
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
    
    cachedApp = app;
  }

  return cachedApp;
}

export default async function handler(req, res) {
  const app = await bootstrapServer();
  const expressInstance = app.getHttpAdapter().getInstance();
  return expressInstance(req, res);
}
