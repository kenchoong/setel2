import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { OrderService } from './services/order.service';
import { IOrderCheckParams } from './type/IOrderCheckParams';
import { IOrderUpdateParams } from './type/IOrderUpdateParams';
import { IOrderCreateParams } from './type/IOrderCreateParams';

@Controller()
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @MessagePattern('create_order')
  public async createOrder(orderBody: IOrderCreateParams) {
    // here get order stuff
    // here will go to trigger order service interact with DB

    const res = await this.orderService.createOrder(orderBody);

    return res;
  }

  @MessagePattern('check_order_status')
  public async checkStatus(data: IOrderCheckParams) {
    // here check status
    return await this.orderService.checkOrderStatus(data);
  }

  @MessagePattern('list_order')
  public async listOrder(userId: string) {
    // here get order stuff
    return await this.orderService.listOrder(userId);
  }

  @MessagePattern('find_order_by_id')
  public async findOrderByOrderId(data: IOrderCheckParams) {
    // here get order stuff
    return await this.findOrderByOrderId(data);
  }

  @MessagePattern('update_order')
  public async updateOrder(updateBody: IOrderUpdateParams) {
    // here get order stuff
  }
}
