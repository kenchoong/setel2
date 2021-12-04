import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { OrderService } from './services/order.service';

@Controller()
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @MessagePattern('create_order')
  public async createOrder() {
    // here get order stuff
    // here will go to trigger order service interact with DB
  }

  @MessagePattern('check_order_status')
  public async checkStatus() {
    // here check status
  }

  @MessagePattern('list_order')
  public async listOrder() {
    // here get order stuff
  }

  @MessagePattern('find_order_by_id')
  public async findOrderByOrderId() {
    // here get order stuff
  }

  @MessagePattern('update_order')
  public async updateOrder() {
    // here get order stuff
  }
}
