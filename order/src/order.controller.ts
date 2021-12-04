import { Controller, Inject } from '@nestjs/common';
import { EventPattern, MessagePattern } from '@nestjs/microservices';
import { OrderService } from './services/order.service';
import { IOrderCheckParams } from './type/IOrderCheckParams';
import { IOrderUpdateParams } from './type/IOrderUpdateParams';
import { IOrderCreateParams } from './type/IOrderCreateParams';
import { IOrder } from './type/IOrder';
import { ICheckOrderResult } from './type/ICheckOrderResult';
import { ICreateOrderResponse } from './responseType/ICreateOrderResponse';
import { ICheckOrderResponse } from './responseType/ICheckOrderResponse';
import { IUpdateOrderResponse } from './responseType/IUpdateOrderResponse';
import { IGetOrderResponse } from './responseType/IGetOrderResponse';
import { IListOrderResponse } from './responseType/IListOrderResponse';
import { IReceivePaymentStatusParams } from './type/IReceivePaymentStatusParams';
//import { IUpdateOrderResponse } from './responseType/IUpdateOrderResponse';

@Controller()
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @MessagePattern('create_order')
  public async createOrder(orderBody: IOrderCreateParams) {
    // here get order stuff
    // here will go to trigger order service interact with DB
    let result: ICreateOrderResponse;

    if (orderBody) {
      try {
        const res: IOrder = await this.orderService.createOrder(orderBody);

        result = {
          status: 200,
          message: 'Create order success',
          order: res,
        };
      } catch (error) {
        result = {
          status: 500,
          message: 'Create order error',
          order: null,
        };
      }
    }

    return result;
  }

  @MessagePattern('check_order_status')
  public async checkStatus(data: IOrderCheckParams) {
    // here check status
    let result: ICheckOrderResponse;
    if (data) {
      const res: ICheckOrderResult = await this.orderService.checkOrderStatus(
        data,
      );
      result = {
        status: 200,
        message: 'Check status success',
        orderStatus: res.orderStatus,
      };
    } else {
      result = {
        status: 500,
        message: 'Check status failed',
        orderStatus: null,
      };
    }

    return result;
  }

  @MessagePattern('list_order')
  public async listOrder(userId: string) {
    // here get order stuff
    let result: IListOrderResponse;
    if (userId) {
      const res: IOrder[] = await this.orderService.listOrder(userId);

      result = {
        status: 200,
        message: 'Get order success',
        orders: res,
      };
    } else {
      result = { status: 200, message: 'UserId not set', orders: null };
    }

    return result;
  }

  @MessagePattern('find_order_by_id')
  public async findOrderByOrderId(data: IOrderCheckParams) {
    // here get order stuff
    let result: IGetOrderResponse;
    if (data) {
      const res: IOrder = await this.orderService.findOrderByOrderId(data);

      result = {
        status: 200,
        message: 'Get order success',
        order: res,
      };
    } else {
      result = {
        status: 200,
        message: 'No data',
        order: null,
      };
    }

    return result;
  }

  @MessagePattern('update_order')
  public async updateOrder(updateBody: IOrderUpdateParams) {
    // here get update stuff
    return await this.orderService.updateOrder(updateBody);
  }

  @EventPattern('receive_payment_status')
  public async receive_order_status(
    paymentStatusUpdate: IReceivePaymentStatusParams,
  ) {
    //this.updateOrder(paymentStatusUpdate);
    return await this.orderService.updatePaymentStatus(paymentStatusUpdate);
  }
}
