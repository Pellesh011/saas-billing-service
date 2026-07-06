import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import compression from 'compression';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  app.use(helmet());
  app.use(compression());

  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('SaaS Billing Service')
    .setDescription('API для управления подписками и биллингом')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth', 'Авторизация')
    .addTag('plans', 'Управление тарифными планами')
    .addTag('customers', 'Управление клиентами')
    .addTag('subscriptions', 'Управление подписками')
    .addTag('invoices', 'Управление счетами')
    .addTag('payments', 'Управление платежами')
    .addTag('usage', 'Metered billing')
    .addTag('webhooks', 'Обработка вебхуков')
    .addTag('analytics', 'Аналитика')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3001;
  await app.listen(port);
  logger.log(`Application running on: http://localhost:${port}`);
  logger.log(`Swagger docs: http://localhost:${port}/api/docs`);
}

bootstrap();
