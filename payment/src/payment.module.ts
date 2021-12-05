import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { ConfigService } from './services/config/ConfigService';
import { ClientProxyFactory } from '@nestjs/microservices';

@Module({
  imports: [],
  controllers: [PaymentController],
  providers: [
    PaymentService,
    ConfigService,
    {
      provide: 'ORDER_SERVICE',
      useFactory: (configService: ConfigService) => {
        const orderServiceOptions = configService.get('orderService');
        return ClientProxyFactory.create(orderServiceOptions);
      },
      inject: [ConfigService],
    },
  ],
})
export class PaymentModule {}
