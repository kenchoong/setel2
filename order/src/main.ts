import { NestFactory } from '@nestjs/core';
import { OrderModule } from './order.module';
import { Transport, TcpOptions } from '@nestjs/microservices';
import { ConfigService } from './services/config/ConfigService';

// Docs here: https://docs.nestjs.com/microservices/basics
async function bootstrap() {
  const app = await NestFactory.createMicroservice(OrderModule, {
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0', // just expose it to 0.0.0.0 first, figure out later
      port: new ConfigService().get('port'), // should get the post here
    },
  } as TcpOptions);
  await app.listen();
}
bootstrap();
