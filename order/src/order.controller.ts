import { Controller, Inject } from '@nestjs/common';
import {
  EventPattern,
  MessagePattern,
  ClientProxy,
} from '@nestjs/microservices';
import { OrderService } from './services/order.service';
import { IOrderUpdateParams } from './type/IOrderUpdateParams';
import { IOrderCreateParams } from './type/IOrderCreateParams';
import { IOrder } from './type/IOrder';
import { ICheckOrderResult } from './type/ICheckOrderResult';
import { ICreateOrderResponse } from './responseType/ICreateOrderResponse';
import { ICheckOrderResponse } from './responseType/ICheckOrderResponse';
import { IGetOrderResponse } from './responseType/IGetOrderResponse';
import { IListOrderResponse } from './responseType/IListOrderResponse';
import { IReceivePaymentStatusParams } from './type/IReceivePaymentStatusParams';
import { ProcessPaymentPayload } from './dto/ProcessPaymentPayloadDto';

@Controller()
export class OrderController {
  constructor(
    @Inject('PAYMENT_SERVICE')
    private readonly paymentServiceClient: ClientProxy,

    private readonly orderService: OrderService,
  ) {}

  async publishEvent(payload: ProcessPaymentPayload): Promise<any> {
    console.log('==== EMITTING MESSAGE =====', payload);
    return this.paymentServiceClient.emit('process_order_payment', payload);
  }

  @EventPattern('receive_payment_status')
  public async receive_order_status(
    paymentStatusUpdate: IReceivePaymentStatusParams,
  ) {
    console.log('========== START UPDATE PAYMENT SERVICE==========');
    const res = await this.orderService.updatePaymentStatus(
      paymentStatusUpdate,
    );
    console.log(res);

    return res;
  }

  @MessagePattern('create_order')
  public async createOrder(orderBody: IOrderCreateParams) {
    // here get order stuff
    // here will go to trigger order service interact with DB
    console.log('========== START CREATE ORDER SERVICE ==========');
    console.log(orderBody);
    let result: ICreateOrderResponse;

    if (orderBody) {
      try {
        const res: IOrder = await this.orderService.createOrder(orderBody);
        console.log(res);

        try {
          const emitMessageResult = await this.publishEvent(
            new ProcessPaymentPayload(res.productId, res.id, res.userId),
          );
          console.log('emitMessageResult== ', emitMessageResult);

          result = {
            status: 200,
            message: 'Create order success, payment processing',
            order: res,
          };
        } catch (error) {
          result = {
            status: 400,
            message: 'Error when trigger payment',
            order: null,
          };
        }
      } catch (error) {
        console.log(error);
        result = {
          status: 400,
          message: 'Create order error, DB error',
          order: null,
        };
      }
    } else {
      console.log('no data');
      result = {
        status: 500,
        message: 'No data comes in',
        order: null,
      };
    }

    return result;
  }

  @MessagePattern('check_order_status')
  public async checkStatus(orderId: string) {
    console.log('========== START CHECK ORDER STATUS SERVICE  ==========');
    // here check status
    let result: ICheckOrderResponse;
    if (orderId) {
      try {
        const res: ICheckOrderResult = await this.orderService.checkOrderStatus(
          orderId,
        );
        console.log(res);
        if (res && res.orderStatus) {
          result = {
            status: 200,
            message: 'Check status success',
            orderStatus: res.orderStatus,
          };
        } else {
          result = {
            status: 200,
            message: 'Check status success',
            orderStatus: 'No order status',
          };
        }
      } catch (err) {
        console.log(err);
        result = {
          status: 400,
          message: 'Error checking status',
          orderStatus: null,
        };
      }
    } else {
      console.log('No data');
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
    console.log('========== START LIST ORDER SERVICE==========');
    // here get order stuff
    let result: IListOrderResponse;
    if (userId) {
      try {
        const res: IOrder[] = await this.orderService.listOrder(userId);
        console.log(res);
        result = {
          status: 200,
          message: 'Get order success',
          orders: res,
        };
      } catch (error) {
        console.log(error);
        result = {
          status: 400,
          message: 'Error when getting order list of a user',
          orders: null,
        };
      }
    } else {
      console.log('No data');
      result = { status: 500, message: 'UserId not set', orders: null };
    }

    return result;
  }

  @MessagePattern('find_order_by_id')
  public async findOrderByOrderId(orderId: string) {
    // here get order stuff
    console.log('========== START GET ORDER BY ID SERVICE==========');
    let result: IGetOrderResponse;
    if (orderId) {
      try {
        const res: IOrder = await this.orderService.findOrderByOrderId(orderId);
        console.log(res);
        result = {
          status: 200,
          message: 'Get order success',
          order: res,
        };
      } catch (err) {
        console.log(err);
        result = {
          status: 400,
          message: 'Error when get 1 order',
          order: null,
        };
      }
    } else {
      console.log('No orderId');
      result = {
        status: 500,
        message: 'No orderId',
        order: null,
      };
    }

    return result;
  }

  @MessagePattern('update_order')
  public async updateOrder(updateBody: IOrderUpdateParams) {
    console.log('========== START UPDATE ORDER SERVICE==========');
    return await this.orderService.updateOrder(updateBody);
  }
}
