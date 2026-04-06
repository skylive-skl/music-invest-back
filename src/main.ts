import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { createOpenApiDocument } from './common/config/openapi.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const document = createOpenApiDocument(app);
  SwaggerModule.setup('api', app, document);

  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  const port = process.env.PORT ?? 3000;
  const host = process.env.HOST ?? '0.0.0.0';

  await app.listen(port, host);
}
void bootstrap();
