import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from './services/config/config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(new ConfigService().get('port'));
}
bootstrap();
