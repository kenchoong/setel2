import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { OrderService } from './services/order.service';
import { IOrderCheck } from './type/IOrderCheck';
import { IOrderUpdate } from './type/IOrderUpdate';

@Controller()
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @MessagePattern('create_order')
  public async createOrder(orderBody) {
    // here get order stuff
    // here will go to trigger order service interact with DB
  }

  @MessagePattern('check_order_status')
  public async checkStatus(data: IOrderCheck) {
    // here check status
  }

  @MessagePattern('list_order')
  public async listOrder(userId: string) {
    // here get order stuff
  }

  @MessagePattern('find_order_by_id')
  public async findOrderByOrderId(orderId: string, userId: string) {
    // here get order stuff
  }

  @MessagePattern('update_order')
  public async updateOrder(updateBody: IOrderUpdate) {
    // here get order stuff
  }
}
