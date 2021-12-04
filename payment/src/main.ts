import { NestFactory } from '@nestjs/core';
import { Transport, TcpOptions } from '@nestjs/microservices';
import { PaymentModule } from './payment.module';
import { ConfigService } from './services/config/ConfigService';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(PaymentModule, {
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0', // just expose it to 0.0.0.0 first, figure out later
      port: new ConfigService().get('port'), // should get the post here
    },
  } as TcpOptions);
  await app.listen();
}
bootstrap();
