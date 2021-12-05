import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './services/order.service';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderSchema } from './schema/order.schema';
import { MongoConfigService } from './services/config/MongoConfig';
import { ConfigService } from './services/config/ConfigService';
import { ClientProxyFactory } from '@nestjs/microservices';

// here should import the db stuff
@Module({
  imports: [
    MongooseModule.forRootAsync({
      useClass: MongoConfigService,
    }),
    MongooseModule.forFeature([
      {
        name: 'Order',
        schema: OrderSchema,
      },
    ]),
  ],
  controllers: [OrderController],
  providers: [
    OrderService,
    ConfigService,
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
export class OrderModule {}
