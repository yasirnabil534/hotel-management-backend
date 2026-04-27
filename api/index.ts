import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from '../src/app.module';

let cachedApp: NestFastifyApplication;

async function bootstrapServer() {
  if (!cachedApp) {
    const app = await NestFactory.create<NestFastifyApplication>(
      AppModule,
      new FastifyAdapter({ logger: false })
    );

    await app.enableCors({
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
    
    // Setup Swagger with custom options for serverless
    SwaggerModule.setup('api', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
      },
      customSiteTitle: 'Hotel Management API Docs',
    });

    await app.init();
    await app.getHttpAdapter().getInstance().ready();
    
    cachedApp = app;
  }

  return cachedApp;
}

export default async function handler(req, res) {
  try {
    const app = await bootstrapServer();
    await app.getHttpAdapter().getInstance().routing(req, res);
  } catch (error) {
    console.error('Handler error:', error);
    res.status(500).json({ error: error.message, stack: error.stack });
  }
}
