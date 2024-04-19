import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { DatabaseModule } from './modules/database/database.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  app.setGlobalPrefix('api/v1')

  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Store API')
    .setVersion('1.0')
    .addTag('store')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const databaseModuleModule = app.select(DatabaseModule);
  await databaseModuleModule.get(DatabaseModule).seed();

  await app.listen(3000);
}
bootstrap();
