import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { swagger } from './app.swagger';
import { ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  swagger(app);

  const reflector = app.get(Reflector);
  app.useGlobalGuards(new JwtAuthGuard(reflector), new RolesGuard(reflector));

  app.enableShutdownHooks();

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap().catch((error) => {
  console.error('Bootstrap failed', error);
  process.exit(1);
});
