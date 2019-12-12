import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as helmet from 'helmet';

import { logger } from './middleware/logger.middleware';
import { rateLimiter } from './middleware/ratelimiter.middleware';
import { config } from './config';

const PORT = config.get('SERVICE_PORT') || 3000;
const bootstrap = async () => {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(helmet());
  app.use(logger);
  app.use(rateLimiter());
  await app.listen(PORT);
};
bootstrap();
