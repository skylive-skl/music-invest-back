import 'dotenv/config';
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { NestFactory } from '@nestjs/core';
import { stringify } from 'yaml';
import { AppModule } from '../app.module';
import { createOpenApiDocument } from '../common/config/openapi.config';

async function generateOpenApi() {
  process.env.SKIP_DB_CONNECT = process.env.SKIP_DB_CONNECT ?? 'true';

  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn'],
  });

  const document = createOpenApiDocument(app);
  const outputDir = resolve(process.cwd(), 'docs', 'openapi');
  const jsonPath = resolve(outputDir, 'openapi.json');
  const yamlPath = resolve(outputDir, 'openapi.yaml');

  mkdirSync(outputDir, { recursive: true });
  writeFileSync(jsonPath, JSON.stringify(document, null, 2), 'utf8');
  writeFileSync(yamlPath, stringify(document), 'utf8');

  await app.close();

  console.log(`OpenAPI spec written to ${jsonPath} and ${yamlPath}`);
}

void generateOpenApi();
