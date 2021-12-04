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
import { IGetOrderResponse } from './responseType/IGetOrderResponse';
import { IListOrderResponse } from './responseType/IListOrderResponse';
import { IReceivePaymentStatusParams } from './type/IReceivePaymentStatusParams';

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
          status: 400,
          message: 'Create order error',
          order: null,
        };
      }
    } else {
      result = {
        status: 500,
        message: 'No data comes in',
        order: null,
      };
    }

    return result;
  }

  @MessagePattern('check_order_status')
  public async checkStatus(data: IOrderCheckParams) {
    // here check status
    let result: ICheckOrderResponse;
    if (data) {
      try {
        const res: ICheckOrderResult = await this.orderService.checkOrderStatus(
          data,
        );
        result = {
          status: 200,
          message: 'Check status success',
          orderStatus: res.orderStatus,
        };
      } catch (err) {
        result = {
          status: 400,
          message: 'Error checking status',
          orderStatus: null,
        };
      }
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
      try {
        const res: IOrder[] = await this.orderService.listOrder(userId);

        result = {
          status: 200,
          message: 'Get order success',
          orders: res,
        };
      } catch (error) {
        result = {
          status: 400,
          message: 'Error when getting order list of a user',
          orders: null,
        };
      }
    } else {
      result = { status: 500, message: 'UserId not set', orders: null };
    }

    return result;
  }

  @MessagePattern('find_order_by_id')
  public async findOrderByOrderId(data: IOrderCheckParams) {
    // here get order stuff
    let result: IGetOrderResponse;
    if (data && data.orderId) {
      try {
        const res: IOrder = await this.orderService.findOrderByOrderId(data);

        result = {
          status: 200,
          message: 'Get order success',
          order: res,
        };
      } catch (err) {
        result = {
          status: 400,
          message: 'Error when get 1 order',
          order: null,
        };
      }
    } else {
      result = {
        status: 500,
        message: 'No data',
        order: null,
      };
    }

    return result;
  }

  @MessagePattern('update_order')
  public async updateOrder(updateBody: IOrderUpdateParams) {
    return await this.orderService.updateOrder(updateBody);
  }

  @EventPattern('receive_payment_status')
  public async receive_order_status(
    paymentStatusUpdate: IReceivePaymentStatusParams,
  ) {
    return await this.orderService.updatePaymentStatus(paymentStatusUpdate);
  }
}
