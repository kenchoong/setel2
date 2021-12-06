import { Module } from '@nestjs/common';

import { OrderController } from './order.controller';

import { ConfigService } from './services/config/config.service';
import { ClientProxyFactory } from '@nestjs/microservices';

@Module({
  imports: [],
  controllers: [OrderController],
  providers: [
    ConfigService,
    {
      provide: 'ORDER_SERVICE',
      useFactory: (configService: ConfigService) => {
        const orderServiceOptions = configService.get('orderService');
        return ClientProxyFactory.create(orderServiceOptions);
      },
      inject: [ConfigService],
    },
    {
      provide: 'PAYMENT_SERVICE',
      useFactory: (configService: ConfigService) => {
        const paymentServiceOptions = configService.get('paymentService');
        return ClientProxyFactory.create(paymentServiceOptions);
      },
      inject: [ConfigService],
    },
  ],
})
export class AppModule {}
