import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function buildOpenApiConfig() {
  return new DocumentBuilder()
    .setTitle('Music Invest API')
    .setDescription('The API for music investment and crowdfunding platform')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
}

export function createOpenApiDocument(app: INestApplication) {
  return SwaggerModule.createDocument(app, buildOpenApiConfig());
}
