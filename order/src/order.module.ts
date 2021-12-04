import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './services/order.service';

// here should import the db stuff
@Module({
  imports: [],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
