import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { SocketIoAdapter } from './adapters/socket-io.adapter';

async function bootstrap(): Promise<void> {
  // Configure body limit from environment (default 15 MB for base64 image payloads)
  const bodyLimitMb = parseInt(process.env.BODY_LIMIT_MB, 10) || 15;

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ bodyLimit: bodyLimitMb * 1024 * 1024 }),
  );

  // Enable global validation pipe — enforces class-validator decorators on DTOs
  app.useGlobalPipes(
    new ValidationPipe({ transform: true, whitelist: false }),
  );

  // Enable CORS
  await app.enableCors({
    origin: true, // Allow all origins
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
  });

  // Enable WebSocket support with Socket.IO
  app.useWebSocketAdapter(new SocketIoAdapter(app));

  const config = new DocumentBuilder()
    .setTitle('Hotel Management API')
    .setDescription('The Hotel Management API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  const appConfigService = app.get(ConfigService);

  await app.listen(appConfigService.get<number>('PORT') || 3000, '0.0.0.0');
}
bootstrap();
