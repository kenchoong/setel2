import { Module } from '@nestjs/common';

import { OrderController } from './order.controller';
import { PaymentController } from './payment.controller';

import { ConfigService } from './services/config/config.service';
import { ClientProxyFactory } from '@nestjs/microservices';

@Module({
  imports: [],
  controllers: [OrderController, PaymentController],
  providers: [
    ConfigService,
    {
      provide: 'ORDER_SERVICE',
      useFactory: (configService: ConfigService) => {
        const tokenServiceOptions = configService.get('orderService');
        return ClientProxyFactory.create(tokenServiceOptions);
      },
      inject: [ConfigService],
    },
    {
      provide: 'PAYMENT_SERVICE',
      useFactory: (configService: ConfigService) => {
        const tokenServiceOptions = configService.get('paymentService');
        return ClientProxyFactory.create(tokenServiceOptions);
      },
      inject: [ConfigService],
    },
  ],
})
export class AppModule {}
