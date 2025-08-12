import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { swagger } from './app.swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  swagger(app);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap().catch((error) => {
  console.error('Bootstrap failed', error);
  process.exit(1);
});
